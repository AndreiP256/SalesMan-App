import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Post()
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return this.loginService.login(loginUserDto);
    }
}