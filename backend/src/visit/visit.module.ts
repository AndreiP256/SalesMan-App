import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';

@Module({
    imports: [],
    providers: [VisitService, ClientService, PrismaService],
    controllers: [VisitController],
    exports: [VisitService],
})
export class VisitModule {}