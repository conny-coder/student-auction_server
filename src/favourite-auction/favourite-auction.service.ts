import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
// @ts-ignore
import { InjectModel } from 'nestjs-typegoose';
import { AuctionModel } from 'src/auction/auction.model';
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

  async getAll(userId: Types.ObjectId) {
    return await this.favouriteAuctionModel
      .find({ userId })
      .populate('auction')
      .exec();
  }

  async isFavourite(userId: Types.ObjectId, auctionId: Types.ObjectId) {
    const favouriteAuction = await this.favouriteAuctionModel.findOne({
      userId,
      auction: auctionId,
    });
    return !!favouriteAuction;
  }
}
