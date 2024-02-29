import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(agentCode) {
    const user = await this.prisma.user.findFirst({
      where: {
        agentCode,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid agent code');
    }

    const payload = { username: user.agentCode, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}