import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Controller, OnModuleInit, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/rooms/entities/room.entity';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';

Controller('messages');
@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnModuleInit {
  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
    private readonly roomsService: RoomsService,
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  public server: Server;
  private connectedClients = [];

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      const token = socket.handshake.query.token;
      const decoded = await this.decodeJWT(token as string);
      if (decoded?.username) {
        this.connectedClients.push({
          username: decoded.username,
          _id: decoded?._id,
        });
        this.server.emit('online', this.connectedClients);
      }

      socket.on('disconnect', (s) => {
        this.connectedClients = this.connectedClients.filter(
          (user) => user._id !== decoded?._id,
        );
        this.server.emit('online', this.connectedClients);
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    try {
      const token = client.handshake.query.token;
      const sender = await this.decodeJWT(token as string);
      const newPayload = JSON.parse(payload);
      console.log(sender);
      if (sender?._id) {
        console.log('PAYLOAD', payload);
        const owner = await this.userService.findOneById(sender._id);
        const recipient = await this.userService.findOneById(
          newPayload.recipient,
        );
        const msg = await this.messagesService.create({
          recipient,
          owner,
          message: newPayload.message,
        });
        this.server.emit('message', msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
  @SubscribeMessage('enter-chat-room')
  async enterChatRoom(
    client: Socket,
    data: { createdBy: ObjectId; users: ObjectId[]; name: string },
  ) {
    try {
      let user = await this.userService.findOneById(data.createdBy.toString());
      if (user) {
        const room = await this.roomsService.create({
          name: data.name,
          connected_users: [...data.users, data.createdBy],
        });
        client.broadcast
          .to(room?._id.toString())
          .emit('users-changed', { user: user._id, event: 'joined' });
      }
    } catch (error) {}
  }

  private async decodeJWT(token: string) {
    return await this.jwtService.decode(token);
  }
}
