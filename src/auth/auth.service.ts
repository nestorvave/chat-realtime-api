import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: LoginDto): Promise<any> {
    const { password, email } = login;
    const user = await this.usersService.findOne(email);
    const { _id, email: emailUser } = user;

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: _id, username: emailUser };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }
}
