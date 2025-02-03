import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CategoryModel } from 'src/category/category.model';
import { UserModel } from 'src/user/user.model';
import { TypeStatus } from './auction.interface';

export interface AuctionModel extends Base {}

export class AuctionModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  description: string;

  @prop({ default: [] })
  images: string[];

  @prop({ ref: () => CategoryModel })
  category: Ref<CategoryModel>;

  @prop({ ref: () => UserModel })
  ownerId: Ref<UserModel>;

  @prop({ min: 0 })
  startPrice: number;

  @prop({
    default: function () {
      return this.startPrice;
    },
  })
  currentBid: number;

  @prop({ ref: () => UserModel, default: null })
  highestBidderId: Ref<UserModel>;

  @prop({ type: () => Date })
  endTime: Date;

  @prop({ default: 'active' })
  status: TypeStatus;

  @prop({ default: 10 })
  step: number;
}
