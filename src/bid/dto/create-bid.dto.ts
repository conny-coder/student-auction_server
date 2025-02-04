import { Ref } from '@typegoose/typegoose';
import { IsNumber, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Types } from 'mongoose';
import { AuctionModel } from 'src/auction/auction.model';

export class CreateBidDto {
  @IsObjectId({ message: 'Id аукціона не коректний' })
  auctionId: Types.ObjectId;

  @IsNumber({}, { message: 'Ціна повинна бути числом' })
  amount: number;
}
