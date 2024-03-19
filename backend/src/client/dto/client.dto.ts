import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  taxCode: string;

  @IsNotEmpty()
  @IsArray()
  phones: string[];

  @IsNotEmpty()
  @IsArray()
  emails: string[];

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  totalOrder?: number;

  @IsNotEmpty()
  @IsNumber()
  salesAgentId: number;

}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsArray()
  phones?: string[];

  @IsOptional()
  @IsArray()
  emails?: string[];

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  totalOrder?: number;

  @IsOptional()
  @IsNumber()
  salesAgentId?: number;
}