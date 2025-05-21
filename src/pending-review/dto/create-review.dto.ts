import { IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";

export class CreateReviewDto {
  @IsObjectId({ message: 'Id користувача не коректний' })
  auction: Types.ObjectId;

  @IsObjectId({ message: 'Id користувача не коректний' })
  target: Types.ObjectId;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString({ message: 'Коментар має бути рядком' })
  @IsNotEmpty({ message: 'Коментар не може бути порожнім' })
  @MinLength(10, { message: 'Коментар повинен бути не менше 10 символів' })
  comment: string;
}