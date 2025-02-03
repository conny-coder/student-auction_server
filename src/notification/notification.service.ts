import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationModel } from './notification.model';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationModel: ModelType<NotificationModel>,
  ) {}

  async getNotificationsByUser(userId: Types.ObjectId) {
    return await this.notificationModel.find({ userId }).exec();
  }

  async changeRead(userId: Types.ObjectId) {
    return await this.notificationModel
      .findOneAndUpdate({ userId }, { isRead: true }, { new: true })
      .exec();
  }

  async createNotification(dto: CreateNotificationDto) {
    return await this.notificationModel.create(dto);
  }
}
