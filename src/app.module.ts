import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    UsersModule,
    AuthModule,
    
  ],
  controllers: [],
})
export class AppModule {}
