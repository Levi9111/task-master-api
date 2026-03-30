import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// The string 'jwt-refresh' MUST match the name we gave the PassportStrategy above
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
