import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/login/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { Prisma } from '@prisma/client'; // Import the Prisma namespace
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Auth(UserRole.MANAGER)
    async create(@Body() CreateUserDto: Prisma.UserCreateInput) { // Use the Prisma namespace for the type
        return this.userService.createUser(CreateUserDto);
    }

    @Get()
    async findAll() {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const userId = Number(id); // Convert id to number
        return this.userService.findOneUser(userId);
    }

    @Get(':id/visits')
    async getUserVisits(@Param('id') id: string) {
        const userId = Number(id); // Convert id to number
        return this.userService.getUserVisits(userId);
    }

    @Get(':id/clients')
    async getUserClients(@Param('id') id: string) {
        const userId = Number(id); // Convert id to number
        return this.userService.getUserClients(userId);
    }

    @Put(':id')
    @Auth(UserRole.MANAGER)
    async update(@Param('id') id: string, @Body() UpdateUserDto: Prisma.UserUpdateInput) {
        const clientId = Number(id); // Convert id to number
        return this.userService.updateUser(clientId, UpdateUserDto);
        
    }

    @Delete(':id')
    @Auth(UserRole.MANAGER)
    async remove(@Param('id') id: string) {
        const clientId = Number(id); // Convert id to number
        return this.userService.removeUser(clientId);
    }
}