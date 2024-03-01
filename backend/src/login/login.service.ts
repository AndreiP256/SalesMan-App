import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

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

    if(user.role !== 'MANAGER') {
      throw new UnauthorizedException('Invalid role');
    }

    const payload = { username: user.agentCode, role: user.role };
    console.log('payload', payload);
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return {
      access_token: token,
    };
  }
}