import {
  IsArray,
  IsString,
  IsNumber,
  IsDate,
  ArrayNotEmpty,
  Min,
  IsPositive,
  IsNotEmpty,
  MinDate,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';

export class CreateAuctionDto {
  @IsString({ message: "Заголовок є обов'язковим полем" })
  @IsNotEmpty({ message: 'Заголовок не може бути порожнім' })
  title: string;

  @IsString({ message: "Опис є обов'язковим полем" })
  @IsNotEmpty({ message: 'Опис не може бути порожнім' })
  description: string;

  @IsArray({ message: 'Поле зображень має бути масивом' })
  @ArrayNotEmpty({ message: 'Додайте хоча би одне зображення' })
  @IsString({ each: true, message: 'Кожне зображення має бути рядком' })
  images: string[];

  @IsObjectId({ message: 'Категорія має бути валідним ObjectId' })
  category: Types.ObjectId;

  @IsNumber({}, { message: 'Стартова ціна повинна бути числом' })
  @Min(0, { message: "Стартова ціна не може бути від'ємною" })
  @IsPositive({ message: 'Стартова ціна повинна бути більше нуля' })
  startPrice: number;

  @IsDateString({}, { message: 'Дата закінчення аукціону має бути датою' })
  endTime: Date;

  @IsNumber({}, { message: 'Крок повинен бути числом' })
  @Min(10, { message: 'Крок повинен бути не менше 10' })
  step: number;

  @IsEnum(['new', 'used'], { message: 'Умова повинна бути "new" або "used"' })
  condition: 'new' | 'used';
}
