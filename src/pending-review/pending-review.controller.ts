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
import { PendingReviewService } from './pending-review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { Types } from 'mongoose';

@Controller('pending-review')
export class PendingReviewController {
  constructor(
    private readonly pendingReviewService: PendingReviewService,
  ) {}

  @Get('pending')
  @Auth()
  async getPending(@User('_id') userId: Types.ObjectId,) {
    return this.pendingReviewService.getPendingForUser(userId);
  }

  @Get('pending/:userId')
  @Auth()
  async getPendingByChat(
    @User('_id') userId: Types.ObjectId,
    @Param('userId') otherUserId: Types.ObjectId,
  ) {
    return this.pendingReviewService.getPendingByChat(userId, otherUserId);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  @HttpCode(200)
  @Auth()
  async createReview(
    @User('_id') userId: Types.ObjectId,
    @Body() dto: CreateReviewDto,
  ) {
    return this.pendingReviewService.createReviewAndClearPending(
      userId,
      dto,
    );
  }
}
