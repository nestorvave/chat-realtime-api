import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './entities/conversation.entity';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private usersService: UsersService,
  ) {}

  async create({ owner: sender, recipient: re }: CreateConversationDto) {
    try {
      const owner = await this.usersService.findOneById(sender);
      const recipient = await this.usersService.findOneById(re);
      delete owner.email;
      delete recipient.email;
      delete recipient.password;
      delete owner.password;
      const conversation = await this.conversationModel.create({
        owner,
        recipient,
        last_message: 'Create conversation',
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
      const conversations = await this.conversationModel.find({
        $or: [{ 'owner._id': userId }, { 'recipient._id': userId }],
      });
      return conversations;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error, check server logs',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
