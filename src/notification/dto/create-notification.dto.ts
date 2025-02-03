import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { IsString } from 'class-validator';
import { TypeNotification } from '../notification.interface';

export class CreateNotificationDto {
  @IsObjectId({ message: 'Id користувача не коректний' })
  userId: Types.ObjectId;

  @IsString()
  message: string;

  @IsString({ message: 'Type не коректний' })
  type: TypeNotification;

  @IsObjectId({ message: 'Id аукціону не коректний' })
  auction: Types.ObjectId;
}
