import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { FavouriteAuctionModel } from './favourite-auction.model';

@Injectable()
export class FavouriteAuctionService {
  constructor(
    @InjectModel(FavouriteAuctionModel)
    private readonly favouriteAuctionModel: ModelType<FavouriteAuctionModel>,
  ) {}

  async set(userId: Types.ObjectId, auctionId: Types.ObjectId) {
    const favouriteAuction = await this.favouriteAuctionModel.findOne({
      userId,
      auctionId,
    });
    if (favouriteAuction) {
      return this.favouriteAuctionModel.findByIdAndDelete(favouriteAuction._id);
    }
    return await this.favouriteAuctionModel.create({
      userId,
      auction: auctionId,
    });
  }

  async delete(userId: Types.ObjectId, auctionId: Types.ObjectId) {
    return await this.favouriteAuctionModel.findOneAndDelete({
      userId,
      auction: auctionId,
    });
  }

  async getAll( userId: Types.ObjectId )
  {
    const favourites = await this.favouriteAuctionModel
      .find( { userId } )
      .populate( 'auction' )
      .exec();

    return favourites.filter( fav => fav.auction !== null );
  }

  async isFavourite(userId: Types.ObjectId, auctionId: Types.ObjectId) {
    const favouriteAuction = await this.favouriteAuctionModel.findOne({
      userId,
      auction: auctionId,
    });
    return !!favouriteAuction;
  }

  
}
