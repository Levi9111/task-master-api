import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users') // Base route: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me') // Maps to GET /users/me
  getProfile(@Request() req) {
    // req.user was populated by the validate() method in our JwtStrategy
    return req.user;
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  getAllUsers() {
    return this.usersService.findAll();
  }
}
