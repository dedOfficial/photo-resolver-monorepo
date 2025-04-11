// src/auth.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

interface AuthServiceGrpc {
  // Метод регистрации: принимает объект с email, password и confirmPassword, возвращает Observable с сообщением и данными пользователя
  register(data: { email: string; password: string; confirmPassword: string }): Observable<{ message: string; user: any }>;
  // Метод логина: принимает email и password, возвращает Observable с accessToken
  login(data: { email: string; password: string }): Observable<{ accessToken: string }>;
}

@Controller('auth')
export class AuthController {
  private authService!: AuthServiceGrpc;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    // Получаем gRPC клиент для AuthService, имя сервиса должно соответствовать тому, что определено в .proto файле
    this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; confirmPassword: string }
  ): Promise<any> {
    try {
      const response = await this.authService.register(body).toPromise();
      return response;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Ошибка регистрации',
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ): Promise<any> {
    try {
      const response = await this.authService.login(body).toPromise();
      return response;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Ошибка аутентификации',
        error.status || HttpStatus.UNAUTHORIZED
      );
    }
  }
}