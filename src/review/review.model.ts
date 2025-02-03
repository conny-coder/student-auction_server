import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';

export interface ReviewModel extends Base {}

export class ReviewModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  userId: Ref<UserModel>;

  @prop({ ref: () => UserModel })
  authorId: Ref<UserModel>;

  @prop()
  rating: number;

  @prop()
  comment: string;
}
