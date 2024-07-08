import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Controller, Get, OnModuleInit, Param } from '@nestjs/common';

Controller('messages')
@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  private connectedClients = [];
  constructor(
    private readonly messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      console.log(`Cliente conectado. Total: ${this.connectedClients}`);

      const token = socket.handshake.query.token;
      const decoded = await this.decodeJWT(token as string);
      if (decoded?.username) {
        console.log(decoded);
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
        console.log('clientes des', this.connectedClients);
        this.server.emit('online', this.connectedClients);
        console.log('cliente desconectado');
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    try {
      const token = client.handshake.query.token;
      const sender = await this.decodeJWT(token as string);
      const newPayload = JSON.parse(payload);
      console.log('new payload', newPayload);
      if (sender?._id) {
        const msg = await this.messagesService.create({
          ...newPayload,
          sender: sender._id,
        });
        console.log('hereeee');
        this.server.emit('message', msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  private async decodeJWT(token: string) {
    return await this.jwtService.decode(token);
  }
}
