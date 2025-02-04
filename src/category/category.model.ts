import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface CategoryModel extends Base {}

export class CategoryModel extends TimeStamps {
  @prop({ unique: true })
  name: string;

  @prop({ unique: true })
  slug: string;
}
