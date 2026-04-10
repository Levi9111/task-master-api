import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TeamsModule } from './teams/teams.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    // load env variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connect to DB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    TeamsModule,
    TasksModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    // Applies JWTAuthGuard to EVERY routes in the app
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
