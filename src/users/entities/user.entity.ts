import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, type: 'string' })
  name: string;

  @Prop({ required: true, type: 'string' })
  password: string;

  @Prop({ unique: true, required: true, type: 'string' })
  email: string;

  @Prop({ type: 'string' })
  avatarUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
