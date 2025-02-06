import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserService } from 'src/user/user.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionModel } from './transaction.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionModel)
    private readonly transactionModel: ModelType<TransactionModel>,
    private readonly userService: UserService,
  ) {}

  async create(userId: Types.ObjectId, dto: CreateTransactionDto) {
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (dto.type === 'withdrawal') {
      if (user.balance < dto.amount)
        throw new BadRequestException('Недостатньо коштів');

      user.balance = user.balance - dto.amount;
      user.save();
    }

    if (dto.type === 'deposit' || dto.type === 'payout') {
      user.balance = user.balance + dto.amount;
      user.save();
    }

    return await this.transactionModel.create({ ...dto, userId });
  }

  async getUserTransactions(userId: Types.ObjectId) {
    return await this.transactionModel
      .find({ userId })
      .sort({ date: -1 })
      .exec();
  }

  async getTransactionById(transactionId: Types.ObjectId) {
    const transaction = await this.transactionModel
      .findById(transactionId)
      .exec();

    if (!transaction) {
      throw new NotFoundException('Транзакція не знайдена');
    }

    return await this.transactionModel.findById(transactionId).exec();
  }

  async delete(transactionId: Types.ObjectId) {
    const transaction = await this.transactionModel
      .findById(transactionId)
      .exec();

    if (!transaction) {
      throw new NotFoundException('Транзакція не знайдена');
    }

    return await this.transactionModel.findByIdAndDelete(transactionId).exec();
  }
}
