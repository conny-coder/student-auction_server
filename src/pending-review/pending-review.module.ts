import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PendingReviewController } from './pending-review.controller';
import { PendingReviewService } from './pending-review.service';
import { PendingReviewModel } from './pending-review.model';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PendingReviewModel,
        schemaOptions: {
          collection: 'PendingReview',
        },
      },
    ]),
    ReviewModule
  ],
  controllers: [PendingReviewController],
  providers: [PendingReviewService],
  exports: [PendingReviewService],
})
export class PendingReviewModule {}
