import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { MessageService } from 'src/message/message.service';
import { ChatModel } from './chat.model';

@Injectable()
export class ChatService {
  constructor(
    // @ts-ignore
    @InjectModel(ChatModel) private readonly chatModel: ModelType<ChatModel>,
    private readonly messageService: MessageService,
  ) {}

  async create(user1: Types.ObjectId, user2: Types.ObjectId) {
    return this.chatModel.create({ user1, user2 });
  }

  async getAll(userId: Types.ObjectId) {
    return this.chatModel.find({ $or: [{ user1: userId }, { user2: userId }] });
  }

  async getById(chatId: Types.ObjectId) {
    const chat = await this.chatModel.findById(chatId).exec();

    if (!chat) {
      throw new NotFoundException('Чат не знайдено');
    }

    const messages = await this.messageService.getAllByChat(chatId);

    return {
      chat,
      messages,
    };
  }

  async delete(chatId: Types.ObjectId) {
    const chat = await this.chatModel.findById(chatId);

    if (!chat) {
      throw new NotFoundException('Чат не знайдено');
    }

    return this.chatModel.findByIdAndDelete(chatId);
  }
}
