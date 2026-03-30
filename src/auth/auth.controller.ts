import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
