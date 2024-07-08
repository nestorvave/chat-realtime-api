import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const msg = await this.messageModel.create(createMessageDto);
    return msg;
  }

  async findMsg(sender: string) {
    try {
      const allMessages = await this.messageModel.find({ sender });
      console.log(allMessages)
      return allMessages;
    } catch (error) {}
  }
}
