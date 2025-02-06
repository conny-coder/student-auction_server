import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { TypeReportStatus } from './report.interface';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @HttpCode(200)
  @Auth()
  async create(
    @User('_id') userId: Types.ObjectId,
    @Body() dto: CreateReportDto,
  ) {
    return this.reportService.create(userId, dto);
  }

  @Get()
  @Auth('admin')
  async getAll(@Query('type') type?: TypeReportStatus) {
    return this.reportService.getAll(type);
  }

  @Get(':id')
  @Auth('admin')
  async getById(@Param('id') id: Types.ObjectId) {
    return this.reportService.getById(id);
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.reportService.delete(id);
  }

  @Put(':id')
  @Auth('admin')
  async respondToReport(@Param('id') id: Types.ObjectId) {
    return this.reportService.respondToReport(id);
  }
}
