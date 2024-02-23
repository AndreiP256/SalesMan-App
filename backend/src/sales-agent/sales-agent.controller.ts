import { Controller } from '@nestjs/common';
import { SalesAgentService } from './sales-agent.service';

@Controller('sales-agent')
export class SalesAgentController {
    constructor(private readonly salesAgentService: SalesAgentService) {}
}