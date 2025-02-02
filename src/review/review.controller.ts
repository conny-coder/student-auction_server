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
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { SetReviewDto } from './dto/set-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':userId')
  @Auth()
  async getReviewsByUser(
    @Param('userId', idValidationPipe) userId: Types.ObjectId,
  ) {
    return this.reviewService.getReviewsByUser(userId);
  }

  @UsePipes(new ValidationPipe())
  @Post('set')
  @HttpCode(200)
  @Auth()
  async setRating(
    @User('_id') authorId: Types.ObjectId,
    @Body() dto: SetReviewDto,
  ) {
    return this.reviewService.setReview(authorId, dto);
  }
}
