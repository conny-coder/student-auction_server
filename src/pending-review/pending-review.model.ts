import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AuctionModel } from 'src/auction/auction.model';
import { UserModel } from 'src/user/user.model';

export interface PendingReviewModel extends Base {}

export class PendingReviewModel extends TimeStamps {
  @prop({ ref: () => UserModel, required: true })
  reviewer: Ref<UserModel>;

  @prop({ ref: () => UserModel, required: true })
  target: Ref<UserModel>;

  @prop({ ref: () => AuctionModel, required: true })
  auction: Ref<AuctionModel>;

  @prop({ default: false })
  isCompleted: boolean;
}
