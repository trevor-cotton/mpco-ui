import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
