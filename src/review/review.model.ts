import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface ReviewModel extends Base {}

export class ReviewModel extends TimeStamps {
  @prop()
  userId: Types.ObjectId;

  @prop()
  authorId: Types.ObjectId;

  @prop()
  rating: number;

  @prop()
  comment: string;
}
