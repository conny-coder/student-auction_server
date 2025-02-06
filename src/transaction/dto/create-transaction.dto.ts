import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { TypeTransaction } from '../transaction.interface';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Кількість коштів має бути числом' })
  amount: number;

  @IsEnum(['withdrawal', 'deposit', 'payment', 'payout'], {
    message: 'Неправильний тип транзакції',
  })
  type: TypeTransaction;

  @IsOptional()
  transactionToId?: Types.ObjectId;

  @IsOptional()
  transactionById?: Types.ObjectId;
}
