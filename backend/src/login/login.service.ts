import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(agentCode) {
    const user = await this.prisma.user.findFirst({
      where: {
        agentCode: agentCode,
      },
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid agent code');
    }
  
    const payload = { username: user.agentCode };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}