import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
    MANAGER = 'MANAGER',
    DRIVER = 'DRIVER',
    SALES_AGENT = 'SALES_AGENT',
  }

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  agentCode: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  
    @IsOptional()
    @IsString()
    agentCode?: string;
  }