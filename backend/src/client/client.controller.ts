import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { Auth } from 'src/login/decorators/auth.decorator';
import { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';
import { VisitService } from 'src/visit/visit.service';

@Controller('clients')
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        private readonly visitService: VisitService,
        ) {}

    @Post()
    @Auth(UserRole.MANAGER, UserRole.SALES_AGENT)
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

    @Get(':id/visits')
    async getClientVisits(@Param('id') id: string) {
        const clientId = Number(id); // Convert id to number
        return this.clientService.getClientVisits(clientId);
    }

    @Post(':id/visits')
    async scheduleVisit(@Param('id') id: string, @Body() createVisitDto: Prisma.VisitCreateInput) {
        const clientId = Number(id); // Convert id to number
        return this.visitService.createVisitForClient({ ...createVisitDto, clientId });
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