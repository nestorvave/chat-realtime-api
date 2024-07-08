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

  async findMsg(sender: string, recipient: string) {
    try {
      const allMessages = await this.messageModel
        .find({
          $or: [
            { sender: sender, recipient: recipient },
            { sender: recipient, recipient: sender },
          ],
        })
        .sort({ createdAt: "asc" });
      return allMessages;
    } catch (error) {
      throw error; 
    }
  }
}
