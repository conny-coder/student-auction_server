import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface LocationModel extends Base {}

export class LocationModel extends TimeStamps {
  @prop()
  city: string;

  @prop()
  region: string;
}
