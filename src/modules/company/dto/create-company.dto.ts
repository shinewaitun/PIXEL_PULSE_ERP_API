import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsObject,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsUUID()
  subscriptionId!: string;

  @IsNotEmpty()
  @IsString()
  number!: string;

  @IsNotEmpty()
  @IsString()
  img_url!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  contact_info!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  subscription_date?: Date;

  @IsOptional()
  @IsDateString()
  expiry_date?: Date;

  @IsOptional()
  @IsObject()
  setting?: Record<string, any>;
}
