import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  // Временное хранилище пользователей (в реальном проекте использовать базу данных)
  private users = new Map<string, { email: string; password: string, id: string }>();

  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string): Promise<any> {
    if (this.users.has(email)) {
      throw new UnauthorizedException('Пользователь уже существует');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = v4();
    const user = { id, email, password: hashedPassword };
    this.users.set(email, user);
    return user;
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = this.users.get(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    const payload = { sub: user.id, email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}