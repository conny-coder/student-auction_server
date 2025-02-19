import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatModel } from './chat.model';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    // @ts-ignore
    TypegooseModule.forFeature([
      {
        typegooseClass: ChatModel,
        schemaOptions: {
          collection: 'Chat',
        },
      },
    ]),
    MessageModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
