import { IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString({ message: 'Місто має бути рядком' })
  city: string;

  @IsString({ message: 'Область має бути рядком' })
  region: string;
}
