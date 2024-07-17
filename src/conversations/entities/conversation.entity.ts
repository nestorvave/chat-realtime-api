import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ versionKey: false, timestamps: true })
export class Conversation {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
    unique: false,
  })
  recipient: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
    unique: false,
  })
  owner: string;

  @Prop({
    type: 'string',
  })
  last_message: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
