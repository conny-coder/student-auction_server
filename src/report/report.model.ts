import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { UserModel } from 'src/user/user.model';
import { TypeReportStatus } from './report.interface';

export interface ReportModel extends Base {}

export class ReportModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  text: string;

  @prop({ ref: () => UserModel })
  reportedBy: Types.ObjectId;

  @prop({ required: false })
  reportedTo?: string;

  @prop({ enum: ['pending', 'responded'], default: 'pending' })
  status: TypeReportStatus;
}
