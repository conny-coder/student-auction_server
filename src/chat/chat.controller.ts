import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':userId')
  @HttpCode(200)
  @Auth()
  async create(
    @User('_id') user1: Types.ObjectId,
    @Param('userId') user2: Types.ObjectId,
  ) {
    return this.chatService.create(user1, user2);
  }

  @Get()
  @Auth()
  async getAll(@User('_id') userId: Types.ObjectId) {
    return this.chatService.getAll(userId);
  }

  @Get(':chatId')
  @Auth()
  async getById(@Param('chatId') chatId: Types.ObjectId) {
    return this.chatService.getById(chatId);
  }

  @Delete(':chatId')
  @HttpCode(200)
  @Auth()
  async delete(@Param('chatId') chatId: Types.ObjectId) {
    return this.chatService.delete(chatId);
  }
}
