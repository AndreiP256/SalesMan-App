import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  async createVisit(data: Prisma.VisitCreateInput) {
    const visit = await this.prisma.visit.create({
        data,
    });
    return visit;
  }

  async findAllVisits() {
    const visits = await this.prisma.visit.findMany();
    return visits;
  }

  async findOneVisit(id: number) {
    const visit = await this.prisma.visit.findUnique({ where: { id } });
    return visit;
  }

  async updateVisit(id: number, data: Prisma.VisitUpdateInput) {
    const visit = await this.prisma.visit.update({ where: { id }, data });
    return visit;
  }
  
async createVisitForClient(data: Prisma.VisitCreateInput & { clientId: number }) {
    const { clientId, ...visitData } = data;
    return this.prisma.visit.create({
        data: {
            ...visitData,
            client: {
                connect: { id: clientId },
            },
        },
    });
}

async removeVisit(id: number) {
    const visit = await this.prisma.visit.delete({ where: { id } });
    return visit;
}
}