import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MsgController {
  constructor(private readonly msgService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.msgService.create(createMessageDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.msgService.findByConversation(id);
  }
}
