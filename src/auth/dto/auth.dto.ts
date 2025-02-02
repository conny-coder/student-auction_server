import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Пароль не може бути менше 6 символів!' })
  @IsString()
  password: string;
}

export class AuthRegisterDto extends AuthLoginDto {
  @MinLength(4, { message: 'Username не може бути менше 4 символів!' })
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  name?: string;
}
