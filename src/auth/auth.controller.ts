import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth') //Sets the base route '/auth'
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // '/auth/register'
  async register(@Body() reigsterDto: RegisterDto) {
    return this.authService.register(reigsterDto);
  }
}
