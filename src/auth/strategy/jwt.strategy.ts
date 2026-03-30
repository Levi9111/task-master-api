import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly confingService: ConfigService) {
    super({
      // 1. Tells to look for a Bearer token in the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Reject expired tokens automatically
      ignoreExpiration: false,
      secretOrKey: confingService.get<string>('JWT_ACCESS_SECRET') as string,
    });
  }

  //   only calls if the token is successfully verified
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
