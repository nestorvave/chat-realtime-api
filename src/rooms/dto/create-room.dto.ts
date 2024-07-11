import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongoose";
import { User } from "src/users/entities/user.entity";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  connected_users: ObjectId[];

  @IsString()
  @IsOptional()
  lastMessage?: string;
}


