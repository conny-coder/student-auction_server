import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
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
}
