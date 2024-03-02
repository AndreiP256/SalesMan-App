import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

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
    console.log('payload', payload);
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return {
      access_token: token,
    };
  }

  async validateUser(payload: any): Promise<any> {
    // Get the username from the JWT payload
    const agentCode = payload.agentCode;

    // Find the user in the database
    const user = await this.prisma.user.findFirst({
      where: {
        agentCode: agentCode,
      },
    });

    if (!user) {
      // If the user is not found, throw an exception
      throw new UnauthorizedException();
    }

    // If the user is found, return the user object
    return user;
  }
}