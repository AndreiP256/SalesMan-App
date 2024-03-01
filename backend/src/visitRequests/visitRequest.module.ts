import { Module } from '@nestjs/common';
import { VisitRequestService } from './visitRequest.service';
import { VisitRequestController } from './visitRequest.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VisitRequestController],
  providers: [VisitRequestService, PrismaService],
})
export class VisitRequestModule {}