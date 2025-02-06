import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { TransactionModel } from './transaction.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TransactionModel,
        schemaOptions: {
          collection: 'Transaction',
        },
      },
    ]),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
