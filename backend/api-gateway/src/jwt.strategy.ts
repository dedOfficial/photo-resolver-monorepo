import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY',
    });
  }

  async validate(payload: any) {
    console.log('JwtStrategy validate payload:', payload);
    // Если что-то не так, выбрасываем UnauthorizedException
    if (!payload || !payload.sub) {
      throw new UnauthorizedException();
    }
    // Вернём объект пользователя, который будет доступен в req.user
    return { id: payload.sub, ...payload };
  }
}
