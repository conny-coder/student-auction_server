import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReportModel } from './report.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReportModel,
        schemaOptions: {
          collection: 'Report',
        },
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
