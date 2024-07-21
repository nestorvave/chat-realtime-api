import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Controller, OnModuleInit, Param } from '@nestjs/common';
import mongoose, { ObjectId } from 'mongoose';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Room } from 'src/rooms/entities/room.entity';

Controller('messages');
@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnModuleInit {
  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
    private readonly roomsService: RoomsService,
    private readonly userService: UsersService,
    private readonly conversationService: ConversationsService,
  ) {}

  @WebSocketServer()
  public server: Server;
  private connectedClients = [];

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      const token = socket.handshake.query.token;
      const decoded = await this.decodeJWT(token as string);
      if (decoded?.username) {
        this.connectedClients.push(decoded?._id);
        this.server.emit('online', this.connectedClients);
      }

      socket.on('disconnect', (s) => {
        this.connectedClients = this.connectedClients.filter(
          (user) => user !== decoded?._id,
        );
        this.server.emit('online', this.connectedClients);
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(_: Socket, @MessageBody() payload: string) {
    try {
      const newPayload: {
        recipient: string;
        owner: string;
        conversation_id: string | null;
        message: string;
      } = JSON.parse(payload);
      const { recipient, owner, conversation_id, message } = newPayload;
      const msg = await this.messagesService.create({
        recipient,
        owner,
        message,
        conversation_id,
      });
      await this.conversationService.updateLastMessage(
        conversation_id,
        message,
      );
      this.server.emit('message', msg);
    } catch (error) {
      console.log(error);
    }
  }
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    _: Socket,
    @MessageBody()
    payload: string,
  ) {
    try {
      let newPayload = JSON.parse(payload);
      const room = await this.roomsService.create(newPayload);
      console.log(room);
      if (room._id) {
        this.server.emit('room-created', room._id);
      }
    } catch (error) {}
  }

  private async decodeJWT(token: string) {
    return await this.jwtService.decode(token);
  }
}
