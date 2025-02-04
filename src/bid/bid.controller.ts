import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  async create(@User('_id') userId: Types.ObjectId, @Body() dto: CreateBidDto) {
    return this.bidService.create(userId, dto);
  }

  @Get('auction/:id')
  @Auth()
  async getAuctionBids(@Param('id') auctionId: Types.ObjectId) {
    return this.bidService.getAuctionBids(auctionId);
  }

  @Get('user/:id')
  @Auth()
  async getUserBids(@Param('id') userId: Types.ObjectId) {
    return this.bidService.getUserBids(userId);
  }
}
