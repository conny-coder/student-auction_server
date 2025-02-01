import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async create(name: string, email: string) {
    return this.userModel.create({ name, email });
  }

  async getAll() {
    return this.userModel.find().exec();
  }
}
