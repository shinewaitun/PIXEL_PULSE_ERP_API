import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { UserSubscription } from '../enums/user-subscription.enum';

export class CreateUserDto {
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(UserRole, { message: 'Role is not correct!' })
  role: UserRole;

  @IsEnum(UserSubscription, { message: 'Subscription is not correct!' })
  @IsOptional()
  subscription: UserSubscription;

  @IsBoolean({ message: 'Active status is not correct!' })
  @IsOptional()
  isActive: boolean;
}
