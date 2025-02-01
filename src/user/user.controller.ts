import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: { name: string; email: string }) {
    return this.userService.create(dto.name, dto.email);
  }

  @Get()
  async getAll() {
    return this.userService.getAll();
  }
}
