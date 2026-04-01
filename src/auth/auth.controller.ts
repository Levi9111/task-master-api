import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth') //Sets the base route '/auth'
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // '/auth/register'
  async register(@Body() reigsterDto: RegisterDto) {
    return this.authService.register(reigsterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Changes default 201 Created to 200
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    // req.user was populated by JwtRefreshStrategy.validate()

    const { userId, refreshToken } = req.user;

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Body() logoutDto: LogoutDto) {
    // req.user is provided by jwtAuthGuard
    return this.authService.logout(req.user.userId, logoutDto.refreshToken);
  }
}
