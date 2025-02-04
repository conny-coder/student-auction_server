import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { AuctionModel } from 'src/auction/auction.model';
import { UserModel } from 'src/user/user.model';

export interface BidModel extends Base {}

export class BidModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  userId: Ref<UserModel>;

  @prop({ ref: () => AuctionModel })
  auctionId: Ref<AuctionModel>;

  @prop()
  amount: number;
}
