import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { TypeSortBy } from './auction.interface';
import { AuctionModel } from './auction.model';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(AuctionModel)
    private readonly auctionModel: ModelType<AuctionModel>,
  ) {}

  async getCountByCategory(categoryId: Types.ObjectId) {
    return await this.auctionModel
      .countDocuments({ category: categoryId })
      .exec();
  }

  async create(ownerId: Types.ObjectId, dto: CreateAuctionDto) {
    return await this.auctionModel.create({ ...dto, ownerId });
  }

  async getAll(filters: {
    category?: string;
    price?: string;
    condition?: 'new' | 'used';
    search: string;
    sortBy?: TypeSortBy;
  }) {
    const filterQuery: any = {};

    if (filters.price) {
      const [min, max] = filters.price.split('-');
      filterQuery.currentBid = { $gte: min, $lte: max };
    }

    if (filters.category) {
      const categoryList = filters.category.split(',');
      filterQuery.category = { $in: categoryList };
    }

    if (filters.condition) {
      filterQuery.condition = filters.condition;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      filterQuery.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ];
    }

    let sortQuery: any = {};

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          sortQuery.createdAt = -1;
          break;
        case 'popularity':
          sortQuery.bidCount = -1;
          break;
        case 'priceUp':
          sortQuery.currentBid = 1;
          break;
        case 'priceDown':
          sortQuery.currentBid = -1;
          break;
        default:
          break;
      }
    }

    return await this.auctionModel.find(filterQuery).sort(sortQuery).exec();
  }

  async closeAuction(auctionId: Types.ObjectId) {
    return await this.auctionModel
      .findByIdAndUpdate(auctionId, { status: 'cancelled' }, { new: true })
      .exec();
  }

  async getAuctionById(auctionId: Types.ObjectId) {
    return await this.auctionModel.findById(auctionId).exec();
  }
}
