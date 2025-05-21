import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  userName: string;

  @prop({ unique: true })
  email: string;

  @prop()
  password: string;

  @prop({ default: '/uploads/avatar.png' })
  avatar: string;

  @prop({ default: 0 })
  balance: number;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({ default: 0 })
  rating: number;

  @prop({ default: 'Користувач' })
  name: string;

  @prop({ default: false })
  isConfirmed: boolean; 
}
