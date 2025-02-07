import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { BidModel } from './bid.model';
import { AuctionModule } from 'src/auction/auction.module';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: BidModel,
        schemaOptions: {
          collection: 'Bid',
        },
      },
    ]),
    AuctionModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
