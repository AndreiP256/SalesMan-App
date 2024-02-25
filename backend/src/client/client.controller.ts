import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { Auth } from 'src/login/decorators/auth.decorator';
import { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    @Auth(UserRole.MANAGER)
    async create(@Body() CreateClientDto: Prisma.ClientCreateInput & { salesAgentId: number }) {
        return this.clientService.createClient(CreateClientDto);
    }

    @Get()
    async findAll() {
        return this.clientService.findAllClients();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const clientId = Number(id); // Convert id to number
        return this.clientService.findOneClient(clientId);
    }

    @Put(':id')
    @Auth(UserRole.MANAGER)
    async update(@Param('id') id: string, @Body() UpdateClientDto: Prisma.ClientUpdateInput) {
        const clientId = Number(id); // Convert id to number
        return this.clientService.updateClient(clientId, UpdateClientDto);
    }

    @Delete(':id')
    @Auth(UserRole.MANAGER)
    async remove(@Param('id') id: string) {
        const clientId = Number(id); // Convert id to number
        return this.clientService.removeClient(clientId);
    }
}