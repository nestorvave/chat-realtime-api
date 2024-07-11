import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsEmail()
  owner: User;

  @IsString()
  @IsNotEmpty()
  recipient: User;

  @IsString()
  @IsNotEmpty()
  message: string;
}
