import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(6, { message: 'Пароль не може бути менше 6 символів!' })
  @IsString({ message: 'Пароль повинен бути рядком' })
  oldPassword: string;

  @MinLength(6, { message: 'Пароль не може бути менше 6 символів!' })
  @IsString({ message: 'Пароль повинен бути рядком' })
  password: string;
}
