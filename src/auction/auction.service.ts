import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { FavouriteAuctionService } from 'src/favourite-auction/favourite-auction.service';
import { TypeSortBy } from './auction.interface';
import { AuctionModel } from './auction.model';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(AuctionModel)
    private readonly auctionModel: ModelType<AuctionModel>,
    private readonly favouriteAuctionService: FavouriteAuctionService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  async getCountByCategory(categoryId: Types.ObjectId) {
    return await this.auctionModel
      .countDocuments({ category: categoryId })
      .exec();
  }

  async create(ownerId: Types.ObjectId, dto: CreateAuctionDto) {
    return await this.auctionModel.create({ ...dto, ownerId });
  }

  async updateCurrentBid(
    userId: Types.ObjectId,
    auctionId: Types.ObjectId,
    amount: number,
  ) {
    const auction = await this.auctionModel.findById(auctionId).exec();
    const neededNextBid = auction.currentBid + auction.step;

    if (amount < neededNextBid) {
      throw new BadRequestException('Ціна повинна бути більшою за поточну');
    }

    return await this.auctionModel
      .findByIdAndUpdate(
        auctionId,
        { currentBid: amount, $inc: { bidCount: 1 }, highestBidderId: userId },
        { new: true },
      )
      .exec();
  }

  async getAll(
    filters: {
      category?: string;
      price?: string;
      condition?: 'new' | 'used';
      search: string;
      sortBy?: TypeSortBy;
    },
    userId: Types.ObjectId,
  ) {
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

    const favorites = await this.favouriteAuctionService.getAll(userId);
    const favouriteAuctionIds = favorites.map((favorite) =>
      favorite.auction._id.toString(),
    );

    const auctions = await this.auctionModel
      .find(filterQuery)
      .sort(sortQuery)
      .exec();

    const auctionsWithFavorites = auctions.map((auction) => ({
      ...auction.toObject(),
      isFavourite: favouriteAuctionIds.includes(auction._id.toString()),
    }));

    const sortedAuctions = auctionsWithFavorites.sort(
      (a, b) => +b.isFavourite - +a.isFavourite,
    );

    return sortedAuctions;
  }

  async closeAuction(auctionId: Types.ObjectId) {
    return await this.auctionModel
      .findByIdAndUpdate(auctionId, { status: 'cancelled' }, { new: true })
      .exec();
  }

  async getAuctionById(userId: Types.ObjectId, auctionId: Types.ObjectId) {
    const auction = await this.auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw new NotFoundException('Аукціон не знайдено');
    }

    const auctionWithIsFavourite = {
      ...auction.toObject(),
      isFavourite: await this.favouriteAuctionService.isFavourite(
        userId,
        auctionId,
      ),
    };

    return auctionWithIsFavourite;
  }

  @Cron('*/1 * * * *')
  async checkAndCompleteAuctions() {
    const now = new Date();

    const expiredAuctions = await this.auctionModel
      .find({
        endTime: { $lte: now },
        status: { $ne: 'completed' },
      })
      .exec();

    for (const auction of expiredAuctions) {
      auction.status = 'completed';
      await auction.save();

      await this.notificationService.createNotification({
        auction: auction._id,
        userId: auction.ownerId,
        message: `Ваш аукціон завершено.`,
        type: 'auction_ended',
      });

      if (auction.highestBidderId) {
        await this.notificationService.createNotification({
          auction: auction._id,
          userId: auction.highestBidderId,
          message: `Ви виграли аукціон!`,
          type: 'auction_won',
        });
      }
    }
  }

  async delete(userId: Types.ObjectId, auctionId: Types.ObjectId) {
    const owner = await this.userService.getById(userId);
    const auction = await this.auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw new NotFoundException('Аукціон не знайдено');
    }
    if (!userId.equals(new Types.ObjectId(auction.ownerId)) && !owner.isAdmin) {
      throw new BadRequestException('Ви не можете видалити цей аукціон');
    }

    if (auction.highestBidderId) {
      const highestBidder = await this.userService.getById(
        auction.highestBidderId,
      );

      if (highestBidder) {
        await this.userService.updateUser(highestBidder._id, {
          balance: highestBidder.balance + auction.currentBid,
        });
      }
    }

    return await this.auctionModel.findByIdAndDelete(auctionId).exec();
  }
}
