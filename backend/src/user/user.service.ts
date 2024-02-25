import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
        data,
    });
    return user;
  }

  async findAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOneUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({ where: { id }, data });
    return user;
  }

  async removeUser(id: number) {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }
}