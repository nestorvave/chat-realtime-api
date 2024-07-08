import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetMessagesDto } from './dto/get-messages.dto';

@Controller('messages')
export class MsgController {
  constructor(private readonly msgService: MessagesService) {}

  @Post('get-by-both')
  async getMessages(@Body() { sender, recipient }: GetMessagesDto) {
    try {
      const messages = await this.msgService.findMsg(sender, recipient); // Convierte userId a número si es necesario
      return messages;
    } catch (error) {
      console.error('Error al obtener mensajes:', error.message);
      throw error; // Manejar el error de manera adecuada en tu aplicación
    }
  }
}
