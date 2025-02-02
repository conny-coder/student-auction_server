import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({
    message: 'Ви не передали refreshToken або це не рядок',
  })
  refreshToken: string;
}
