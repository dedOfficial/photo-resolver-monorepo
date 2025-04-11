import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  async register(@Body() body: { email: string; password: string; confirmPassword: string }) {
    if (body.password !== body.confirmPassword) {
      throw new UnauthorizedException('Пароли не совпадают');
    }
    const user = await this.authService.register(body.email, body.password);
    return { message: 'Пользователь зарегистрирован', user };
  }
  
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}