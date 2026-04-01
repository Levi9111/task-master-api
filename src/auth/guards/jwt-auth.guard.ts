import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
// We pass 'jwt' to match the name of the strategy we extended
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Check if the @Public() decorator is present on the route or the controller
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If it is possible, bypass the guard completely
    if (isPublic) return true;

    // 3. Or run the standard Passport JWT validation
    return super.canActivate(context);
  }
}
