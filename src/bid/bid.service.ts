import { BadRequestException, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ArgumentOutOfRangeError } from 'rxjs';
import { AuctionService } from 'src/auction/auction.service';
import { BidModel } from './bid.model';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(BidModel) private readonly bidModel: ModelType<BidModel>,
    private readonly auctionService: AuctionService,
  ) {}

  async create(userId: Types.ObjectId, dto: CreateBidDto) {
    await this.auctionService.updateCurrentBid(
      userId,
      dto.auctionId,
      dto.amount,
    );

    return await this.bidModel.create({ ...dto, userId });
  }

  async getAuctionBids(auctionId: Types.ObjectId) {
    return await this.bidModel.find({ auctionId }).exec();
  }

  async getUserBids(userId: Types.ObjectId) {
    return await this.bidModel.find({ userId }).exec();
  }
}
