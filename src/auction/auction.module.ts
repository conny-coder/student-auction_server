import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuctionModel } from './auction.model';
import { FavouriteAuctionModule } from 'src/favourite-auction/favourite-auction.module';
import { NotificationModule } from 'src/notification/notification.module';

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
    AuctionModule,
    FavouriteAuctionModule,
    NotificationModule,
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
