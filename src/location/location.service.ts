import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationModel } from './location.model';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(LocationModel)
    private readonly locationModel: ModelType<LocationModel>,
  ) {}

  async create(dto: CreateLocationDto) {
    return await this.locationModel.create({ ...dto });
  }

  async getAll() {
    return await this.locationModel.find().exec();
  }

  async getById(id: Types.ObjectId) {
    const location = await this.locationModel.findById(id).exec();

    if (!location) {
      throw new NotFoundException('Локація не знайдена');
    }

    return location;
  }

  async delete(id: Types.ObjectId) {
    const location = await this.locationModel.findById(id).exec();

    if (!location) {
      throw new NotFoundException('Локація не знайдена');
    }

    return await this.locationModel.findByIdAndDelete(id).exec();
  }

  async getByRegion(region: string) {
    return await this.locationModel.find({ region }).exec();
  }

  async update(id: Types.ObjectId, dto: CreateLocationDto) {
    const location = await this.locationModel.findById(id).exec();

    if (!location) {
      throw new NotFoundException('Локація не знайдена');
    }

    return await this.locationModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
}
