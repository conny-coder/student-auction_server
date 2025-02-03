import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @HttpCode(200)
  @Auth()
  async create(
    @User('_id') ownerId: Types.ObjectId,
    @Body() dto: CreateAuctionDto,
  ) {
    return this.auctionService.create(ownerId, dto);
  }
}
