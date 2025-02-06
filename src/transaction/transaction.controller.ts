import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  async create(
    @User('_id') userId: Types.ObjectId,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.create(userId, dto);
  }

  @Get('user/:id')
  @Auth()
  async getUserTransactions(@Param('id') userId: Types.ObjectId) {
    return this.transactionService.getUserTransactions(userId);
  }

  @Get(':id')
  @Auth('admin')
  async getTransactionById(@Param('id') transactionId: Types.ObjectId) {
    return this.transactionService.getTransactionById(transactionId);
  }

  @Delete(':id')
  @Auth()
  async delete(@Param('id') transactionId: Types.ObjectId) {
    return this.transactionService.delete(transactionId);
  }
}
