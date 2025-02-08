import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageModel } from './message.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: ModelType<MessageModel>,
  ) {}

  async create(senderId: Types.ObjectId, dto: CreateMessageDto) {
    return this.messageModel.create({ ...dto, senderId });
  }

  async delete(id: Types.ObjectId) {
    return this.messageModel.findByIdAndDelete(id);
  }

  async getAllByChat(chatId: Types.ObjectId) {
    return this.messageModel.find({ chatId }).sort({ createdAt: -1 });
  }
}
