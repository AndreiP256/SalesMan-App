import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Visit } from '@prisma/client';

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
    console.log('findOneVisit called with id:', id);
    console.log(new Error().stack);
    const visit = await this.prisma.visit.findUnique({ where: { id } });
    return visit;
  }

  async findVisitsByDate(date: string) {
    console.log(date);
    
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
  
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);
  
    const visits = await this.prisma.visit.findMany({
      where: {
        nextMeeting: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  
    console.log(visits);
    return visits;
  }

  async findVisitsByDateRange(start: Date, end: Date): Promise<Visit[]> {
    console.log(start);
    console.log(end);
    return this.prisma.visit.findMany({
      where: {
        nextMeeting: {
          gte: start,
          lte: end,
        },
      },
    });}

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