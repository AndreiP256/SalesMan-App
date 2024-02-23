import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';

@Module({
    imports: [],
    providers: [VisitService],
    controllers: [VisitController],
    exports: [VisitService],
})
export class VisitModule {}