import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationModel } from './notification.model';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationModel)
    private readonly notificationModel: ModelType<NotificationModel>,
  ) {}

  async getNotificationsByUser(userId: Types.ObjectId) {
    const notifs = await this.notificationModel
      .find( { userId } )
      .populate( "auction" )
      .exec();

    return notifs.filter( ( n ) => n.auction !== null );
  }

  async changeRead(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId
  )
  {
    return this.notificationModel
      .findOneAndUpdate(
        { _id: notificationId, userId },   
        { $set: { isRead: true } },        
        { new: true }                    
      )
      .exec();
  }

  async createNotification(dto: CreateNotificationDto) {
    return await this.notificationModel.create(dto);
  }
}
