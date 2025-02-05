import { BadRequestException, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ArgumentOutOfRangeError } from 'rxjs';
import { AuctionService } from 'src/auction/auction.service';
import { UserService } from 'src/user/user.service';
import { BidModel } from './bid.model';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(BidModel) private readonly bidModel: ModelType<BidModel>,
    private readonly auctionService: AuctionService,
    private readonly userService: UserService,
  ) {}

  async create(userId: Types.ObjectId, dto: CreateBidDto) {
    const auction = await this.auctionService.getAuctionById(
      userId,
      dto.auctionId,
    );
    const newBider = await this.userService.getById(userId);

    if (auction.highestBidderId && auction.highestBidderId.equals(userId)) {
      newBider.balance = newBider.balance + auction.currentBid;
      newBider.save();
    }

    if (!newBider) {
      throw new BadRequestException('Користувача не знайдено');
    }

    if (newBider.balance < dto.amount) {
      throw new BadRequestException('Недостатньо коштів');
    }

    const neededNextBid = auction.currentBid + auction.step;

    if (dto.amount < neededNextBid) {
      throw new BadRequestException('Ціна повинна бути більшою за поточну');
    }

    if (auction.highestBidderId) {
      const previousBidder = await this.userService.getById(
        auction.highestBidderId,
      );

      if (previousBidder) {
        await this.userService.updateUser(auction.highestBidderId, {
          balance: previousBidder.balance + auction.currentBid,
        });
      }
    }

    await this.userService.updateUser(userId, {
      balance: newBider.balance - dto.amount,
    });

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
