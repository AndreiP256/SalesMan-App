import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  async createVisit(data: Prisma.VisitCreateInput & { clientId: number, userId: number, invoice: number}) {
    const { clientId, userId, invoice, ...rest } = data;
    const clientNumberId = Number(clientId);
    const agentNumber= Number(userId);
    const invoiceNumber = parseFloat(String(invoice));

    const visit = await this.prisma.visit.create({
        data: {
            ...rest,
            invoice: invoiceNumber,
            client: {
                connect: {
                    id: clientNumberId
                }
            },
            user : {
              connect: {  
                id: agentNumber
              }
            }
        }
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

  async updateVisit(id: number, data: Prisma.VisitUpdateInput & { clientId: number, userId: number, invoice: number, id: number}) {
    const { clientId, userId, invoice, id: _, ...rest } = data;
    const clientNumberId = Number(clientId);
    const agentNumber = Number(userId);
    const invoiceNumber = parseFloat(String(invoice));
  
    const visit = await this.prisma.visit.update({
      where: { id },
      data: {
        ...rest,
        invoice: invoiceNumber,
        client: {
          connect: {
            id: clientNumberId
          }
        },
        user: {
          connect: {
            id: agentNumber
          }
        }
      }
    });
  
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