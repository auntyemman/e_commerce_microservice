import {
  IsArray,
  IsEmail,
  IsEnum,
  isEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
  LOGISTICS = 'logistics',
  CUSTOMER_SERVICE = 'customerService',
}

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, {
    message:
      'Password must contain at least one digit, one lowercase, one uppercase letter, and one special character',
  })
  password: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsEnum(RolesEnum, { each: true })
  @IsArray()
  roles: string[];

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  createdBy: string;
}
