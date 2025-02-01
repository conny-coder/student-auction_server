import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ required: true })
  name: string;

  @prop({ unique: true, required: true })
  email: string;
}
