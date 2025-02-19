import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({ collection: 'Location', timestamps: true })
export class Location {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  region: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
