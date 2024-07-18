import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './entities/conversation.entity';
import { Model } from 'mongoose';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async create({ owner, recipient }: CreateConversationDto) {
    try {
      let conversation = await this.findOne(owner, recipient);
      if (conversation) return conversation;
      conversation = await this.conversationModel.create({
        owner,
        recipient,
        last_message: 'Create a conversation',
      });
      return conversation;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error, check server logs',
      );
    }
  }

  async findAll(userId: string) {
    try {
      const conversations = await this.conversationModel
        .find({
          $or: [{ owner: userId }, { recipient: userId }],
        })
        .populate('recipient')
        .populate('owner')
        .sort({ updatedAt: -1 });

      return conversations;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error, check server logs',
      );
    }
  }

  async findOne(owner: string, recipient: string) {
    try {
      const conversation = await this.conversationModel
        .findOne({
          $or: [
            { $and: [{ owner: owner }, { recipient: recipient }] },
            { $and: [{ owner: recipient }, { recipient: owner }] },
          ],
        })
        .populate('recipient')
        .populate('owner');

      return conversation;
    } catch (error) {
      console.error('Error en findOne:', error);
      throw error;
    }
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
