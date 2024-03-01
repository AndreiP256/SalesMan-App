import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { RolesGuard } from './guards/rolesGuards';

console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: () => ({
              secret: process.env.JWT_SECRET,
              signOptions: { expiresIn: '60s' },
            }),
          }),
    ],
    providers: [LoginService, PrismaService, JwtStrategy, JwtService, JwtAuthGuard, RolesGuard],
    controllers: [LoginController],
    exports: [LoginService, JwtStrategy, RolesGuard, JwtAuthGuard],
})
export class LoginModule {}