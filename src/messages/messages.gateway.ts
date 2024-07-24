import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Controller, OnModuleInit } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';
import { ConversationsService } from 'src/conversations/conversations.service';

Controller('messages');
@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnModuleInit {
  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
    private readonly roomsService: RoomsService,
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
        const userRooms = await this.roomsService.findByUser(decoded._id);
        if (userRooms) {
          userRooms.forEach((room) => {
            socket.join(room._id.toString());
          });
        }
        this.connectedClients.push(decoded?._id);
        this.server.emit('online', this.connectedClients);
      }

      socket.on('disconnect', () => {
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
        recipient: string | string[];
        owner: string;
        conversation_id: string | null;
        room_id: string | null;
        message: string;
      } = JSON.parse(payload);
      const { recipient, owner, conversation_id, message, room_id } =
        newPayload;
      const msg = await this.messagesService.create({
        recipient,
        owner,
        message,
        conversation_id: conversation_id ? conversation_id : null,
        room_id: room_id ? room_id : null,
      });
      if (conversation_id) {
        await this.conversationService.updateLastMessage(
          conversation_id,
          message,
        );
        this.server.emit('message', msg);
      } else {
        this.server.to(room_id).emit('message', msg);
      }
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
      const newPayload = JSON.parse(payload);
      const room = await this.roomsService.create(newPayload);
      if (room._id) {
        this.server.emit('room-created', room._id);
      }
    } catch (error) {}
  }

  private async decodeJWT(token: string) {
    return await this.jwtService.decode(token);
  }
}
