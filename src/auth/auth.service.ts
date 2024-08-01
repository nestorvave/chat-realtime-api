import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: LoginDto): Promise<any> {
    try {
      const { password, email, isGoogle } = login;
      const user = await this.usersService.findOneByEmail(email);
      if (!user && isGoogle) {
        const newUser = await this.usersService.create(login as registerDto);
        const payload = { _id: newUser._id, username: newUser.email };
        const token = await this.createJWT(payload);
        return {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl || '',
          token,
        };
      }
      if (!user && !isGoogle) {
        throw new BadRequestException('User is not registered');
      }
      const { _id, email: emailUser, name, avatarUrl } = user;
      if (user?.password !== password && !isGoogle) {
        throw new UnauthorizedException();
      }
      const payload = { _id, username: emailUser };
      const token = await this.createJWT(payload);
      return {
        _id,
        name,
        email,
        avatarUrl,
        token,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signUp(register: registerDto): Promise<any> {
    const user = await this.usersService.create(register);
    if (user.password !== register.password) {
      throw new UnauthorizedException();
    }
    const { _id, email: emailUser, name } = user;
    delete user.password;

    const payload = { _id, username: name };

    const token = await this.createJWT(payload);
    return { _id, name, email: emailUser, token };
  }

  private async createJWT(payload: { _id: Types.ObjectId; username: string }) {
    return await this.jwtService.signAsync(payload);
  }
}
