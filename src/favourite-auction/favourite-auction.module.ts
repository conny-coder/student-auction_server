import { Module } from '@nestjs/common';
import { FavouriteAuctionService } from './favourite-auction.service';
import { FavouriteAuctionController } from './favourite-auction.controller';
// @ts-ignore
import { TypegooseModule } from 'nestjs-typegoose';
import { FavouriteAuctionModel } from './favourite-auction.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FavouriteAuctionModel,
        schemaOptions: {
          collection: 'FavouriteAuction',
        },
      },
    ]),
  ],
  controllers: [FavouriteAuctionController],
  providers: [FavouriteAuctionService],
  exports: [FavouriteAuctionService],
})
export class FavouriteAuctionModule {}
