import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';


export class CreateVisitRequestDto {
    @IsNotEmpty()
    @IsNumber()
    managerId: number;

    @IsNotEmpty()
    @IsNumber()
    salesAgentId: number;

    @IsNotEmpty()
    @IsNumber()
    clientId: number;

    @IsOptional()
    @IsDate()
    visitDate: Date;

    @IsOptional()
    @IsString()
    status: string;
  }