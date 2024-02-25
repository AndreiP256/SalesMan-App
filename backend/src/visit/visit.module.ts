import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [],
    providers: [VisitService, PrismaService],
    controllers: [VisitController],
    exports: [VisitService],
})
export class VisitModule {}