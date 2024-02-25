import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

async createClient(data: Prisma.ClientCreateInput & { salesAgentId: number }) {
    const { salesAgentId, ...rest } = data;
    const client = await this.prisma.client.create({
        data: {
            ...rest,
            salesAgent: { connect: { id: salesAgentId } },
            totalOrder: 0,
        },
    });
    return client;
}

  async findAllClients() {
    const clients = await this.prisma.client.findMany();
    return clients;
  }

  async findOneClient(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    return client;
  }

  async getClientVisits(clientId: number) {
    return this.prisma.visit.findMany({
      where: { clientId },
    });
  }

  async updateClient(id: number, data: Prisma.ClientUpdateInput) {
    const client = await this.prisma.client.update({ where: { id }, data });
    return client;
  }

  

  async removeClient(id: number) {
    const client = await this.prisma.client.delete({ where: { id } });
    return client;
  }
}