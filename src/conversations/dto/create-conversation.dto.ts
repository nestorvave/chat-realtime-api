import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Message } from 'src/messages/entities/message.entity';

export class CreateConversationDto {
  @IsNotEmpty()
  owner: string;

  @IsString()
  recipient: string;

  @IsArray()
  @IsOptional()
  messages?: Message[];

  @IsString()
  @IsOptional()
  lastMessage?: string;
}
