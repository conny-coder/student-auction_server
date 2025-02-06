import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';
import { TypeTransaction } from './transaction.interface';

export interface TransactionModel extends Base {}

export class TransactionModel extends TimeStamps {
  @prop({ ref: () => UserModel })
  userId: Types.ObjectId;

  @prop({ enum: ['withdrawal', 'deposit', 'payment', 'payout'] })
  type: TypeTransaction;

  @prop()
  amount: number;

  @prop({ required: false })
  transactionToId?: Types.ObjectId;

  @prop({ required: false })
  transactionById?: Types.ObjectId;
}
