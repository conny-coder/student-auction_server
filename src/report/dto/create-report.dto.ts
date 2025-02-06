import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsOptional()
  @IsObjectId({ message: 'Id користувача не коректний' })
  reportedTo?: Types.ObjectId;

  @IsString({ message: 'Текст має бути рядком' })
  @MinLength(10, { message: 'Текст повинен бути не менше 10 символів' })
  @MaxLength(200, { message: 'Текст повинен бути не більше 200 символів' })
  text: string;

  @IsString({ message: 'Заголовок має бути рядком' })
  @MinLength(5, { message: 'Заголовок повинен бути не менше 10 символів' })
  @MaxLength(50, { message: 'Заголовок повинен бути не більше 50 символів' })
  title: string;
}
