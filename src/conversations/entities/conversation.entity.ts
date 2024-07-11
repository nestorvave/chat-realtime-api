import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({ versionKey: false, timestamps: true })
export class Conversation  {
  @Prop({
    required: true,
    type: User,
    ref: User.name,
  })
  recipient: User;

  @Prop({
    required: true,
    type: User,
    ref: User.name,
  })
  owner: User;

  @Prop({
    type: "string",
  })
  last_message: User;

}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
