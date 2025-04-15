import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}