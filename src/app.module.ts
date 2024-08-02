import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URI_PROD),
    UsersModule,
    AuthModule,
    MessagesModule,
    RoomsModule,
    ConversationsModule,
  ],
  exports: [],
  controllers: [],
})
export class AppModule {}
