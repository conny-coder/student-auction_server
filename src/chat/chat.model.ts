import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';

export interface ChatModel extends Base {}

export class ChatModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  user1: Types.ObjectId;

  @prop({ ref: () => UserModel })
  user2: Types.ObjectId;
}
