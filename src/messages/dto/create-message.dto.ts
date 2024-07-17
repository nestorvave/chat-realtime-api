import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsString()
  conversation_id: string | null;
}
