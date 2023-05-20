import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUser {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @Length(8, 20)
  password: string;

  @IsEnum(Role)
  role: Role;
}
