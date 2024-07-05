import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

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
  async signUp(register: registerDto): Promise<any> {
    const user = await this.usersService.create(register);

    if (user.password !== register.password) {
      throw new UnauthorizedException();
    }
    const { _id, email: emailUser, name } = user;
    delete user.password;

    const payload = { sub: _id, username: emailUser };

    // Firmar el token JWT y devolver el usuario con el token
    const token = await this.jwtService.signAsync(payload);
    return { _id, name, email: emailUser, token };
  }
}
