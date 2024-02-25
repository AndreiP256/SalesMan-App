import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { VisitService } from './visit.service';
import { Auth } from 'src/login/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Auth(UserRole.SALES_AGENT)
  @Auth(UserRole.MANAGER)
  async create(@Body() createVisitDto: Prisma.VisitCreateInput & { salesAgentId: number }) {
    return this.visitService.createVisit(createVisitDto);
  }

  @Get()
  async findAll() {
    return this.visitService.findAllVisits();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const visitId = Number(id); // Convert id to number
    return this.visitService.findOneVisit(visitId);
  }

  @Put(':id')
  @Auth(UserRole.SALES_AGENT)
  @Auth(UserRole.MANAGER)
  async update(@Param('id') id: string, @Body() updateVisitDto: Prisma.VisitUpdateInput) {
    const visitId = Number(id); // Convert id to number
    return this.visitService.updateVisit(visitId, updateVisitDto);
  }

  @Delete(':id')
  @Auth(UserRole.SALES_AGENT)
  @Auth(UserRole.MANAGER)
  async remove(@Param('id') id: string) {
    const visitId = Number(id); // Convert id to number
    return this.visitService.removeVisit(visitId);
  }
}