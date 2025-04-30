import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { AuctionModel } from 'src/auction/auction.model';
import { BidModel } from 'src/bid/bid.model';
import { BidService } from 'src/bid/bid.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    @InjectModel(BidModel) private readonly bidModel: ModelType<BidModel>,
    @InjectModel(AuctionModel)
    private readonly auctionModel: ModelType<AuctionModel>,
  ) {}

  async getAll() {
    return this.userModel.find().exec();
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          rating: newRating,
        },
        { new: true },
      )
      .exec();
  }

async getTopSellers(): Promise<(UserModel & { soldCount: number })[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await this.userModel.aggregate([
      {
        $lookup: {
          from: this.auctionModel.collection.name, // зазвичай 'auctions'
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                status: 'completed',
                highestBidderId: { $ne: null },
                updatedAt: { $gte: oneMonthAgo },
                $expr: { $eq: ['$ownerId', '$$userId'] },
              },
            },
          ],
          as: 'soldAuctions',
        },
      },
      {
        $addFields: {
          soldCount: { $size: '$soldAuctions' },
        },
      },
      {
        $sort: { soldCount: -1 },
      },
      {
        $limit: 8,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
        },
      },
    ]);

    return result;
  }

  async getById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) {
      throw new NotFoundException('Користувач з таким id не знайдено');
    }

    return user;
  }

  async getProfile(id: Types.ObjectId) {
    const user = await this.getById(id);

    const bids = await this.bidModel.find({ userId: id }).exec();
    const winnerAuctions = await this.auctionModel
      .find({
        status: 'completed',
        highestBidderId: id,
      })
      .exec();
    const soldAuctions = await this.auctionModel
      .find({
        status: 'completed',
        ownerId: id,
        highestBidderId: { $ne: null },
      })
      .exec();

    return {
      ...user.toObject(),
      bidsCount: bids.length,
      winnerCount: winnerAuctions.length,
      soldCount: soldAuctions.length,
    };
  }

  async updateUser(id: Types.ObjectId, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Користувач з таким id не знайдено');
    }

    const newEmail = dto?.email || user.email;
    const userWithNewEmail = await this.userModel.findOne({ email: newEmail });

    if (userWithNewEmail && String(userWithNewEmail._id) !== String(id)) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const newUserName = dto?.userName || user.userName;
    const userWithNewUserName = await this.userModel.findOne({
      userName: newUserName,
    });

    if (userWithNewUserName && String(userWithNewEmail._id) !== String(id)) {
      throw new BadRequestException('Користувач з таким userName вже існує');
    }
    
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async changePassword(userId: Types.ObjectId, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).exec();
    const isMatch = await compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Невірний старий пароль');
    }

    const salt = await genSalt(10);
    user.password = await hash(dto.password, salt);

    await user.save();

    return;
  }
}
