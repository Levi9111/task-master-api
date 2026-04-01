import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users') // Base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me') // Maps to GET /users/me
  getProfile(@Request() req) {
    // req.user was populated by the validate() method in our JwtStrategy
    return req.user;
  }
}
