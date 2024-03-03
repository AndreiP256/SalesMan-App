import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/JwtAuthGuard';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Post()
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return this.loginService.login(loginUserDto.agentCode);
    }

    @UseGuards(JwtAuthGuard)
    @Get('verify')
    checkAuth(@Req() req) {
        console.log('req.user', req.user);
        return { userId: req.user.id, role: req.user.role};
    }
}