import {
  Body,
  Controller,
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
import { User } from './decorators/user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  @UsePipes(new ValidationPipe())
  @Put('change-password')
  @HttpCode(200)
  @Auth()
  async changePassword(
    @User('_id') userId: Types.ObjectId,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }

  @Get('top-sellers')
  @Auth()
  async getTopSellersWeek() {
    return this.userService.getTopSellers();
  }

  @Get('profile/:id')
  @Auth()
  async getProfile(@Param('id') id: Types.ObjectId) {
    return this.userService.getProfile(id);
  }

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: Types.ObjectId) {
    return this.userService.getById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @Auth()
  async updateUser(
    @Param('id') id: Types.ObjectId,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }
}
