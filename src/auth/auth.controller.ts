import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() loginAuthDto: LoginDto) {
    return this.authService.signIn(loginAuthDto);
  }
  @Post('register')
  register(@Body() registerAuthDto: registerDto) {
    return this.authService.signUp(registerAuthDto);
  }
}
