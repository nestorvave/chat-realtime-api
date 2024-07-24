import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ versionKey: false, timestamps: true })
export class Room {
  @Prop({ required: true, maxlength: 20, minlength: 5, unique: false })
  name: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: User.name }],
    required: true,
    unique: false,
  })
  users: string[];

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
    unique: false,
  })
  owner: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
