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

    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async changePassword(userId: Types.ObjectId, dto: ChangePasswordDto) {
    const user = await this.getById(userId);

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
