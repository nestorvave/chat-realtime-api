import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ versionKey: false, timestamps: true })
export class Conversation {
  @Prop({
    required: true,
    type: User,
    ref: User.name,
    unique: false,
  })
  recipient: User;

  @Prop({
    required: true,
    type: User,
    ref: User.name,
    unique: false,
  })
  owner: User;

  @Prop({
    type: 'string',
  })
  last_message: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
