import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

async createClient(data: Prisma.ClientCreateInput & { salesAgentId: number }) {
  const { salesAgentId, latitude, longitude, ...rest } = data;

  // Convert latitude and longitude to float
  const latitudeFloat = parseFloat(String(latitude));
  const longitudeFloat = parseFloat(String(longitude));
  const numberAgentId = Number(salesAgentId);

  // Check if latitude and longitude are valid numbers
  if (isNaN(latitudeFloat) || isNaN(longitudeFloat)) {
    throw new Error('Invalid latitude or longitude');
  }

  const client = await this.prisma.client.create({
    data: {
      ...rest,
      latitude: latitudeFloat,
      longitude: longitudeFloat,
      salesAgent: {
        connect: {
          id: numberAgentId // salesAgentId is already a number, no need to convert
        }
      },
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

  async updateClient(id: number, data: Prisma.ClientUpdateInput & { salesAgentId?: number }) {
    const { salesAgentId, latitude, longitude, ...rest } = data;

    // Convert latitude and longitude to float
    const latitudeFloat = parseFloat(String(latitude));
    const longitudeFloat = parseFloat(String(longitude));

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitudeFloat) || isNaN(longitudeFloat)) {
      throw new Error('Invalid latitude or longitude');
    }

    const updateData: Prisma.ClientUpdateInput = {
      ...rest,
      latitude: latitudeFloat,
      longitude: longitudeFloat,
    };

    if (salesAgentId !== undefined) {
      const numberAgentId = Number(salesAgentId);
      updateData.salesAgent = {
        connect: {
          id: numberAgentId
        }
      };
    }

    const client = await this.prisma.client.update({
      where: { id },
      data: updateData
    });

    return client;
  }

  async removeClient(id: number) {
    // Delete all related Visit records
    await this.prisma.visit.deleteMany({ where: { clientId: id } });

    // Delete all related Phone records
    await this.prisma.phone.deleteMany({ where: { clientId: id } });

    // Delete all related Email records
    await this.prisma.email.deleteMany({ where: { clientId: id } });

    // Now you can delete the Client
    const client = await this.prisma.client.delete({ where: { id } });

    return client;
}
}