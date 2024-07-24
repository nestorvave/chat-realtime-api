import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes } from 'mongoose';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  owner: string;

  @Prop([
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: User.name,
    },
  ])
  recipient: mongoose.Schema.Types.ObjectId | mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true, type: 'string' })
  message: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
    default: null,
  })
  room_id?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Conversation.name,
    default: null,
  })
  conversation_id?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
