import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";
import { User } from "src/users/entities/user.entity";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  messages?: string;

  @IsArray()
  connectedUsers: ObjectId[];
}


