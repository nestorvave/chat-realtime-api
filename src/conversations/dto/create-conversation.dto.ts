import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  @IsString()
  recipient: string;
}
