import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  agentCode: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}