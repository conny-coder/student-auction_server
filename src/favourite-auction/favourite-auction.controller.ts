import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { FavouriteAuctionService } from './favourite-auction.service';

@Controller('favourite-auction')
export class FavouriteAuctionController {
  constructor(
    private readonly favouriteAuctionService: FavouriteAuctionService,
  ) {}

  @Post(':auctionId')
  @HttpCode(200)
  @Auth()
  async set(
    @User('_id') userId: Types.ObjectId,
    @Param('auctionId') auctionId: Types.ObjectId,
  ) {
    return this.favouriteAuctionService.set(userId, auctionId);
  }

  @Delete(':auctionId')
  @HttpCode(200)
  @Auth()
  async delete(
    @User('_id') userId: Types.ObjectId,
    @Param('auctionId') auctionId: Types.ObjectId,
  ) {
    return this.favouriteAuctionService.delete(userId, auctionId);
  }

  @Get()
  @Auth()
  async getAll(@User('_id') userId: Types.ObjectId) {
    return this.favouriteAuctionService.getAll(userId);
  }
}
