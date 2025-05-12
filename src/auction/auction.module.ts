import { forwardRef, Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuctionModel } from './auction.model';
import { FavouriteAuctionModule } from 'src/favourite-auction/favourite-auction.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { BidModule } from 'src/bid/bid.module';
import { PendingReviewModule } from 'src/pending-review/pending-review.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AuctionModel,
        schemaOptions: {
          collection: 'Auction',
        },
      },
    ]),
    FavouriteAuctionModule,
    NotificationModule,
    UserModule,
    PendingReviewModule,
    forwardRef(() => BidModule)
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
