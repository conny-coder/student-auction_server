import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { use } from 'passport';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { TypeSortBy } from './auction.interface';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  async create(
    @User('_id') ownerId: Types.ObjectId,
    @Body() dto: CreateAuctionDto,
  ) {
    return this.auctionService.create(ownerId, dto);
  }

  @Get()
  @Auth()
  async getAll(
    @User('_id') userId: Types.ObjectId,
    @Query('category') category?: string,
    @Query('price') price?: string,
    @Query('condition') condition?: 'new' | 'used',
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: TypeSortBy,
  ) {
    return this.auctionService.getAll(
      {
        category,
        price,
        condition,
        search,
        sortBy,
      },
      userId,
    );
  }

  @Put(':auctionId')
  @HttpCode(200)
  @Auth()
  async closeAuction(@Param('auctionId') auctionId: Types.ObjectId) {
    return this.auctionService.closeAuction(auctionId);
  }

  @Get(':auctionId')
  @Auth()
  async getAuctionById(
    @User('_id') userId: Types.ObjectId,
    @Param('auctionId') auctionId: Types.ObjectId,
  ) {
    return this.auctionService.getAuctionById(userId, auctionId);
  }
}
