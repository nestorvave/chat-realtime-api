import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OnModuleInit } from '@nestjs/common';

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
    const token = client.handshake.query.token;
    const sender = await this.decodeJWT(token as string);
    if (sender?._id) {
      console.log(`Message from client ${sender?.username}: ${payload} `);
      this.server.emit('message', payload);
    }
  }
  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }
  private async decodeJWT(token: string) {
    return await this.jwtService.decode(token);
  }
}
