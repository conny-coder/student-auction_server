import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { IsString } from 'class-validator';
import { TypeNotification } from '../notification.interface';
import { Ref } from '@typegoose/typegoose';
import { UserModel } from 'src/user/user.model';

export class CreateNotificationDto {
  @IsObjectId({ message: 'Id користувача не коректний' })
  userId: Ref<UserModel>;

  @IsString()
  message: string;

  @IsString({ message: 'Type не коректний' })
  type: TypeNotification;

  @IsObjectId({ message: 'Id аукціону не коректний' })
  auction: Types.ObjectId;
}
