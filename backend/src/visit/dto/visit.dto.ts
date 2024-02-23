import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateVisitDto {
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsNotEmpty()
  @IsDate()
  meetingTime: Date;

  @IsNotEmpty()
  @IsString()
  conclusion: string;

  @IsOptional()
  @IsDate()
  nextMeeting?: Date;

  @IsOptional()
  @IsNumber()
  invoice?: number;

  @IsNotEmpty()
  @IsString()
  visitCode: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class UpdateVisitDto {
    @IsOptional()
    @IsNumber()
    clientId?: number;
  
    @IsOptional()
    @IsDate()
    meetingTime?: Date;
  
    @IsOptional()
    @IsString()
    conclusion?: string;
  
    @IsOptional()
    @IsDate()
    nextMeeting?: Date;
  
    @IsOptional()
    @IsNumber()
    invoice?: number;
  
    @IsOptional()
    @IsString()
    visitCode?: string;
  
    @IsOptional()
    @IsNumber()
    userId?: number;
  }