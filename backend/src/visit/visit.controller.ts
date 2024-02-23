import { Controller } from '@nestjs/common';
import { VisitService } from './visit.service';

@Controller('visit')
export class VisitController {
    constructor(private readonly visitService: VisitService) {}
}