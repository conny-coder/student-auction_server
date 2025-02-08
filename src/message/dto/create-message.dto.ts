import { IsObjectId } from 'class-validator-mongo-object-id';

import { Types } from 'mongoose';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsObjectId({ message: 'Id чата не коректний' })
  chatId: Types.ObjectId;

  @IsString({ message: 'Текст повинен бути рядком' })
  text: string;
}
