import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuctionModel } from './auction.model';

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
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
