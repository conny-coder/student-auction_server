import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { PendingReviewModel } from './pending-review.model';
import { ReviewService } from 'src/review/review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class PendingReviewService {
  constructor(
    @InjectModel(PendingReviewModel)
    private readonly pendingReviewModel: ModelType<PendingReviewModel>,

    private readonly reviewService: ReviewService,
  ) {}

  async createPendingReview(
    reviewer: Types.ObjectId,
    target: Types.ObjectId,
    auction: Types.ObjectId,
  ) {
    return this.pendingReviewModel.create({
      reviewer,
      target,
      auction,
    });
  }

  async getPendingForUser(userId: Types.ObjectId) {
    return this.pendingReviewModel
      .find({ reviewer: userId })
      .populate('target auction')
      .exec();
  }

  async createReviewAndClearPending(
    authorId: Types.ObjectId,
    dto: CreateReviewDto,
  ) {
    const pending = await this.pendingReviewModel.findOne({
      reviewer: authorId,
      target: dto.target,
      auction: dto.auction,
    });

    if (!pending) {
      throw new BadRequestException(
        'Відгук уже залишено або не очікується.',
      );
    }

    await this.reviewService.setReview(authorId, {
      comment: dto.comment,
      rating: dto.rating,
      userId: dto.target,
    });

    await this.pendingReviewModel.deleteOne({ _id: pending._id });

    return { success: true };
  }
}
