import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return this.AuthService.register(dto);
  }

   @Get('confirm')
  async confirm(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    if (!token) {
      throw new BadRequestException('Токен відсутній');
    }

    await this.AuthService.confirmEmail(token);

    return res
      .status(200)
      .send(`
        <!DOCTYPE html>
        <html><body style="font-family:sans-serif; text-align:center; margin-top:50px">
          <h1>Акаунт підтверджено ✅</h1>
          <p>Дякуємо, тепер ви можете увійти в додаток.</p>
        </body></html>
      `);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewTokens(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.AuthService.login(dto);
  }
}
