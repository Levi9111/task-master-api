import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the route's metadata

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles are strictly required, let them through
    if (!requiredRoles) return true;

    // 3. Grab the user object that our JwtAuthGuard attached to the request
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if the user's role exists in the array of required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      // 403 Forbidden means "I know who you are (authenticated), but you aren't allowed here (unauthorized)"
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
