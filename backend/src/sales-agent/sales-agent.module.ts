import { Module } from '@nestjs/common';
import { SalesAgentService } from './sales-agent.service';
import { SalesAgentController } from './sales-agent.controller';

@Module({
    imports: [],
    providers: [SalesAgentService],
    controllers: [SalesAgentController],
    exports: [SalesAgentService],
})
export class SalesAgentModule {}