import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetMessagesDto } from './dto/get-messages.dto';

@Controller('messages')
export class MsgController {
  constructor(private readonly msgService: MessagesService) {}

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.msgService.findByConversation(id);
  }
}
