import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VisitService } from 'src/visit/visit.service';

@Module({
    imports: [],
    providers: [ClientService, PrismaService, VisitService],
    controllers: [ClientController],
    exports: [ClientService],
})
export class ClientModule {}