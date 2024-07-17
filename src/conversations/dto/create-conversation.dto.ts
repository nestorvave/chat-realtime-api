import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Message } from 'src/messages/entities/message.entity';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  owner: string;
  
  @IsNotEmpty()
  @IsString()
  recipient: string;
  

}
