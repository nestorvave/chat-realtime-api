import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({ required: true, type: 'string' })
  sender: string;

  @Prop({ required: true, type: 'string' })
  recipient: string;

  @Prop({ required: true, type: 'string' })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
