import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { MESSAGES } from 'src/constants';
import { UserRole } from '../enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  firstname?: string;

  @IsNotEmpty()
  surname?: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    },
    { message: MESSAGES.STRONG_PASSWORD },
  )
  password: string;

  @IsOptional()
  @IsString()
  role?: UserRole;
}
