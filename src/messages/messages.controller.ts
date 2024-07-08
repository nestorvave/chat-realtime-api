import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MsgController {
  constructor(private readonly msgService: MessagesService) {}

  @Get(':senderId')
  async getMessages(@Param('senderId') senderId: string) {
    try {
      console.log('here');
      console.log(senderId);
      const messages = await this.msgService.findMsg(senderId); // Convierte userId a número si es necesario
      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes:', error.message);
      throw error; // Manejar el error de manera adecuada en tu aplicación
    }
  }
}
