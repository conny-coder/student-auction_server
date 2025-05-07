import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { IsEnum, IsString } from 'class-validator';
import { TypeNotification } from '../notification.interface';

export class CreateNotificationDto {
  @IsObjectId({ message: 'Id користувача не коректний' })
  userId: Types.ObjectId;

  @IsEnum(
    [
      'auction_ended',
      'auction_won',
      'auction_ended_no_buyer',
      'auction_lost',
      'new_bid',
    ],
    {
      message: 'Type не коректний',
    },
  )
  type: TypeNotification;

  @IsObjectId({ message: 'Id лоту не коректний' })
  auction: Types.ObjectId;
}
