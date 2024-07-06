import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  private connectedClients = [];
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      console.log(`Cliente conectado. Total: ${this.connectedClients}`);

      const token = socket.handshake.query.token;
      const decoded = await this.decodeJWT(token as string);
      if (decoded?.username) {
        this.connectedClients.push(decoded?.username!);
        this.server.emit('online', this.connectedClients);
      }

      socket.on('disconnect', (s) => {
        this.connectedClients = this.connectedClients.filter(
          (user) => user !== decoded?.username,
        );
        console.log('clientes des', this.connectedClients);
        this.server.emit('online', this.connectedClients);
        console.log('cliente desconectado');
      });
    });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    const token = client.handshake.query.token;
    const sender = await this.decodeJWT(token as string);
    if (sender?.username) {
      console.log(`Message from client ${sender?.username}: ${payload} `);
      this.server.emit('message', payload);
    }
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
  private async decodeJWT(token: string) {
    return await this.jwtService.decode(token);
  }
}
