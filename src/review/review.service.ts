import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserService } from 'src/user/user.service';
import { SetReviewDto } from './dto/set-review.dto';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewModel: ModelType<ReviewModel>,
    private readonly userService: UserService,
  ) {}

  async getReviewsByUser(userId: Types.ObjectId) {
    return this.reviewModel.find({ userId }).exec();
  }

  async averageRatingByUser(userId: Types.ObjectId | string) {
    const ratingsUser: ReviewModel[] = await this.reviewModel
      .aggregate()
      .match({
        userId: new Types.ObjectId(userId),
      })
      .exec();

    const rating =
      ratingsUser.reduce((acc, item) => acc + item.rating, 0) /
      ratingsUser.length;

    return parseFloat(rating.toFixed(1));
  }

  async setReview(authorId: Types.ObjectId, dto: SetReviewDto) {
    const newReview = await this.reviewModel.create({
      ...dto,
      authorId: authorId,
    });

    const averageRating = await this.averageRatingByUser(dto.userId);

    await this.userService.updateRating(dto.userId, averageRating);

    return newReview;
  }
}
