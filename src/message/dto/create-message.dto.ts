import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../message.interface';

export class CreateMessageDto {
  @IsObjectId({ message: 'Id чата не коректний' })
  chatId: Types.ObjectId;

  @IsEnum(['text', 'file'], { message: 'Тип повинен бути "text" або "file"' })
  type: MessageType;

  @IsOptional()
  @IsString({ message: 'Текст повинен бути рядком' })
  text?: string;

  @IsOptional()
  @IsString({ message: 'Посилання повинно бути рядком' })
  fileUrl?: string;
}
