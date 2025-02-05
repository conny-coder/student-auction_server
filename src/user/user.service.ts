import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async getAll() {
    return this.userModel.find().exec();
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          rating: newRating,
        },
        { new: true },
      )
      .exec();
  }

  async getById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Користувач з таким id не знайдено');
    }

    return user;
  }

  async updateUser(id: Types.ObjectId, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Користувач з таким id не знайдено');
    }

    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
