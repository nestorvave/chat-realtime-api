import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Schema({ versionKey: false, timestamps: true })
export class Room {
  @Prop({ required: true, maxlength: 20, minlength: 5 })
  name: string;

  @Prop({ type: [{ type: User, ref: User.name }] })
  connected_users: User[];

  @Prop({
    type: 'string',
  })
  last_message: User;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
