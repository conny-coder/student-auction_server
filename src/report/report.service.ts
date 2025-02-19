import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
// @ts-ignore
import { InjectModel } from 'nestjs-typegoose';
import { CreateReportDto } from './dto/create-report.dto';
import { TypeReportStatus } from './report.interface';
import { ReportModel } from './report.model';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(ReportModel)
    private readonly reportModel: ModelType<ReportModel>,
  ) {}

  async create(reportedBy: Types.ObjectId, dto: CreateReportDto) {
    return await this.reportModel.create({
      ...dto,
      reportedBy,
    });
  }
  async getAll(type: TypeReportStatus) {
    const filter = type ? { status: type } : {};
    return await this.reportModel.find(filter).exec();
  }

  async getById(id: Types.ObjectId) {
    return await this.reportModel.findById(id).exec();
  }

  async delete(id: Types.ObjectId) {
    return await this.reportModel.findByIdAndDelete(id).exec();
  }

  async respondToReport(id: Types.ObjectId) {
    // Write something about chat respond with reported user
    return await this.reportModel
      .findByIdAndUpdate(id, { type: 'resolved' }, { new: true })
      .exec();
  }
}
