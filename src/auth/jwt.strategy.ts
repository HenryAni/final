import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto123',
    });
    console.log('JwtStrategy inicializada ✅');
  }

  async validate(payload: any) {
    console.log('Payload en validate:', payload);
    return { id: payload.sub, correo: payload.correo, rol: payload.rol };
  }
}
