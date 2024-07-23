import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsString({ each: true })
  @IsNotEmpty()
  recipient: string | string[];

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsString()
  conversation_id: string | null;

  @IsNotEmpty()
  @IsString()
  room_id: string | null;
}
