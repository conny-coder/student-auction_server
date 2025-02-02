import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class SetReviewDto {
  @IsObjectId({ message: 'Id користувача не коректний' })
  userId: Types.ObjectId;

  @IsNumber()
  // @Min(1)
  // @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
