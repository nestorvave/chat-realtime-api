import { Module } from '@nestjs/common';

import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { MsgController } from './messages.controller';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
  controllers: [MsgController],
})
export class MessagesModule {}
