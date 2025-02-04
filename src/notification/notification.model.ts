import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { AuctionModel } from 'src/auction/auction.model';
import { UserModel } from 'src/user/user.model';
import { TypeNotification } from './notification.interface';

export interface NotificationModel extends Base {}

export class NotificationModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  userId: Ref<UserModel>;

  @prop()
  type: TypeNotification;

  @prop()
  message: string;

  @prop({ default: false })
  isRead: boolean;

  @prop({ref: () => AuctionModel})
  auction: Ref<AuctionModel>;
}
