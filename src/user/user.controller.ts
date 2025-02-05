import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: Types.ObjectId) {
    return this.userService.getById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @Auth()
  async updateUser(@Param('id') id: Types.ObjectId, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }
}
