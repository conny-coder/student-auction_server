import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
// @ts-ignore
import { TypegooseModule } from 'nestjs-typegoose';
import { MessageModel } from './message.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MessageModel,
        schemaOptions: {
          collection: 'Message',
        },
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
