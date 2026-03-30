import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// We pass 'jwt' to match the name of the strategy we extended
export class JwtAuthGuard extends AuthGuard('jwt') {}
