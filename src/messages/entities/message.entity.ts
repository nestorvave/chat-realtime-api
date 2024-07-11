import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';


@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({
    required: true,
    type: User,
    ref: User.name,
  })
  sender: User;

  @Prop({
    required: true,
    type: User,
    ref: User.name,
  })
  recipient: User;

  @Prop({ required: true, type: 'string' })
  message: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
  })
  room_id?: string;
  
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
  })
  conversation_id?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
