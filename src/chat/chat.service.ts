import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { MessageService } from 'src/message/message.service';
import { ChatModel } from './chat.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatModel) private readonly chatModel: ModelType<ChatModel>,
    private readonly messageService: MessageService,
  ) {}

  async create(user1: Types.ObjectId, user2: Types.ObjectId) {
    const chat = await this.chatModel
      .findOne({ $or: [
      { user1: user1, user2: user2 },
      { user1: user2, user2: user1 }
      ] })
      .exec();

    if (chat) {
      return chat;
    }

    return this.chatModel.create({ user1, user2 });
  }

  async getAll(userId: Types.ObjectId) {
    const chats = await this.chatModel
      .find({ $or: [{ user1: userId }, { user2: userId }] })
      .populate('user1 user2')
      .exec();

    const result = await Promise.all(
      chats
        .filter(chat => chat.user1 && chat.user2) 
        .map(async (chat) => {
          const allMessages = await this.messageService.getAllByChat(chat._id);
          const lastMessage = allMessages.length ? allMessages[0] : null;

          const otherUser = chat.user1._id.equals(userId)
            ? chat.user2
            : chat.user1;

          if (!otherUser) return null; 

          return {
            chatId: chat._id,
            otherUser,
            lastMessage,
            updatedAt: chat.updatedAt,
          };
        })
    );

    return result.filter(Boolean);
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
