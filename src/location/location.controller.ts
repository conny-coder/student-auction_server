import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  async create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @Get()
  @Auth()
  async getAll() {
    return this.locationService.getAll();
  }

  @Get('by-region/:region')
  @Auth()
  async getByRegion(@Param('region') region: string) {
    return this.locationService.getByRegion(region);
  }

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: Types.ObjectId) {
    return this.locationService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: CreateLocationDto,
  ) {
    return this.locationService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.locationService.delete(id);
  }
}
