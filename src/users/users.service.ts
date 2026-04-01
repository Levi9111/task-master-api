import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password -refreshToken').exec();
  }

  async addRefreshToken(
    userId: string | Types.ObjectId,
    refreshToken: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(refreshToken, salt);

    await this.userModel.findByIdAndUpdate(userId, {
      $push: { refreshToken: hashedToken }, // Adds to the array for multi-device support
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) return null;

    // Iterate through the array of refresh tokens
    for (const hashedToken of user.refreshToken) {
      const isMatch = await bcrypt.compare(refreshToken, hashedToken);
      if (isMatch) return user;
    }

    return null;
  }

  async removeRefreshToken(
    userId: string,
    refreshTokenToRemove: string,
  ): Promise<User | void> {
    const user = await this.findById(userId);

    if (!user) return;

    const remainingTokens: string[] = [];
    let tokenFound = false;

    for (const hashedToken of user.refreshToken) {
      const isMatch = await bcrypt.compare(refreshTokenToRemove, hashedToken);

      if (isMatch) {
        tokenFound = true;
      } else {
        remainingTokens.push(hashedToken);
      }
    }

    if (tokenFound) {
      await this.userModel.findByIdAndUpdate(userId, {
        $set: {
          refreshToken: remainingTokens,
        },
      });
    }

    await user.save();

    return user;
  }
}
