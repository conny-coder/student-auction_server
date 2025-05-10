import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { hash, genSalt, compare } from 'bcryptjs';

import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { UserModel } from 'src/user/user.model';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Зареєструйтесь!');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Некоректний refreshToken');

    const user = await this.UserModel.findById(result._id);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthRegisterDto) {
    const oldUser = await this.UserModel.findOne({
      $or: [{ email: dto.email }, { userName: dto.userName }],
    });

    if (oldUser)
      throw new BadRequestException(
        'Користувач з таким email або userName вже існує!',
      );

    const salt = await genSalt(10);

    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt),
      userName: dto.userName,
      name: dto.name || 'Користувач',
    });

    const user = await newUser.save();

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthLoginDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Користувач не знайдений');

    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Неправильний пароль');

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      userName: user.userName,
      name: user.name,
    };
  }
}
