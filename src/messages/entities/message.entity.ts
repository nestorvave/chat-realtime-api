import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';


@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  sender: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  recipient: string;

  @Prop({ required: true, type: 'string' })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
