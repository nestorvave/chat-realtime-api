import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessagesDto {
  @IsNotEmpty()
  @IsString()
  sender: string;

  @IsString()
  @IsNotEmpty()
  recipient: string;
}
