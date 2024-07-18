import { Module } from '@nestjs/common';

import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { MsgController } from './messages.controller';
import { UsersModule } from 'src/users/users.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersService } from 'src/users/users.service';
import { ConversationsModule } from 'src/conversations/conversations.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    UsersModule,
    RoomsModule,
    ConversationsModule
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
  controllers: [MsgController],
})
export class MessagesModule {}
