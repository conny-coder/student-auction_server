import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ScheduleModule } from '@nestjs/schedule';
import { BidModule } from 'src/bid/bid.module';
import { BidModel } from 'src/bid/bid.model';
import { AuctionModel } from 'src/auction/auction.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: BidModel,
        schemaOptions: {
          collection: 'Bid',
        },
      },
    ]),
    TypegooseModule.forFeature([
      {
        typegooseClass: AuctionModel,
        schemaOptions: {
          collection: 'Auction',
        },
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
