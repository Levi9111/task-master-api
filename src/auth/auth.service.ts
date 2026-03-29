import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return userResponse;
  }
}
