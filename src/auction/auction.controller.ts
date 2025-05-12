import {
  Body,
  Controller,
  Delete,
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

  @Get('bided')
  @Auth()
  async getAuctionsBided(@User('_id') userId: Types.ObjectId,) {
    return this.auctionService.getAuctionsUserBiddedOn(userId);
  }

  @Get('user/:userId')
  @Auth()
  async getAuctionsByUser(
    @Param('userId') userId: Types.ObjectId,
  ) {
    return this.auctionService.getAuctionsByUser( userId);
  }

  @Put('complete/:auctionId')
  @HttpCode(200)
  @Auth()
  async completeAuction(
    @User('_id') userId: Types.ObjectId,
    @Param('auctionId') auctionId: Types.ObjectId,
  ) {
    return this.auctionService.completeAuction(userId, auctionId);
  }

  @Get(':auctionId')
  @Auth()
  async getAuctionById(
    @User('_id') userId: Types.ObjectId,
    @Param('auctionId') auctionId: Types.ObjectId,
  ) {
    return this.auctionService.getAuctionById(userId, auctionId);
  }

  @Delete(':auctionId')
  @HttpCode(200)
  @Auth()
  async deleteAuction(
    @User('_id') userId: Types.ObjectId,
    @Param('auctionId') auctionId: Types.ObjectId,
  ) {
    return this.auctionService.delete(userId, auctionId);
  }
}
