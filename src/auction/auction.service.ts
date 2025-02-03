import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
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
}
