import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  users: string[];

  @IsString()
  @IsNotEmpty()
  owner: string;
}
