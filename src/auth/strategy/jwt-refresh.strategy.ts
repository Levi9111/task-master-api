import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true, // allows to access the raw request in the validate method
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,
    });
  }

  // The 'req' object is available here because of passReqToCallback: true
  validate(
    req: Request,
    payload: {
      sub: string;
      email: string;
      role: Role;
    },
  ) {
    // Extract the raw token string from the Authorization header
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    // return the standard payload,+ the raw refresh token
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
