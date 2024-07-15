import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  owner: User;

  @IsString()
  @IsNotEmpty()
  recipient: User;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  conversation_id?: string;
}
