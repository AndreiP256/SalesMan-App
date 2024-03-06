import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, VisitRequest } from '@prisma/client';

@Injectable()
export class VisitRequestService {
    constructor(private prisma: PrismaService) {}

    async createVisitRequest(data: Prisma.VisitRequestCreateInput & { clientId: number, salesAgentId: number }) {
        const { clientId, salesAgentId, ...rest } = data;
        const clientNumberId = Number(clientId);
        const salesAgentNumberId = Number(salesAgentId);

        const visitRequest = await this.prisma.visitRequest.create({
            data: {
                ...rest,
                Client: {
                    connect: {
                        id: clientNumberId
                    }
                },
                SalesAgent: {
                    connect: {
                        id: salesAgentNumberId
                    }
                }
            }
        });

        return visitRequest;
    }

    async findAllVisitRequests() {
        const visitRequests = await this.prisma.visitRequest.findMany();
        return visitRequests;
    }

    async findVistRequestsByUser(userId: number) {
        const visitRequests = await this.prisma.visitRequest.findMany({
            where: {
                salesAgentId: userId
            }
        });
        console.log("VisitRequest",userId, visitRequests);
        return visitRequests;
    }

    async findOneVisitRequest(id: number) {
        const visitRequest = await this.prisma.visitRequest.findUnique({ where: { id } });
        return visitRequest;
    }

    async removeVisitRequest(id: number) {
        const visitRequest = await this.prisma.visitRequest.delete({ where: { id } });
        return visitRequest;
    }
}