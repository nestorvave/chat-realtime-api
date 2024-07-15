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

  async findByConversation(conversation_id: string) {
    try {
      const allMessages = await this.messageModel
        .find({
          conversation_id,
        })
        .sort({ createdAt: 'asc' });
      return allMessages;
    } catch (error) {
      throw error;
    }
  }
}
