import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { VisitService } from './visit.service';
import { Visit } from '@prisma/client';
import { Auth } from 'src/login/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateVisitDto, UpdateVisitDto } from './dto/visit.dto';
import { ClientService } from 'src/client/client.service';
import { IsISO8601 } from 'class-validator';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Auth(UserRole.MANAGER, UserRole.SALES_AGENT)
  async create(@Body() createVisitDto: Prisma.VisitCreateInput & { userId: number, clientId: number, invoice: number }) {
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

  @Get('date/:date')
  async findVisitsByDate(@Param('date') date: string) {
    return this.visitService.findVisitsByDate(date);
  }

  @Get('dateRange')
  async findVisitsByDateRange(
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<Visit[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.visitService.findVisitsByDateRange(startDate, endDate);
  }


  @Put(':id')
  @Auth(UserRole.MANAGER, UserRole.SALES_AGENT)
  async update(@Param('id') id: string, @Body() updateVisitDto: Prisma.VisitUpdateInput & { userId: number, clientId: number, invoice: number, id: number}) {
    const visitId = Number(id); // Convert id to number
    return this.visitService.updateVisit(visitId, updateVisitDto);
  }

  @Delete(':id')
  @Auth(UserRole.MANAGER, UserRole.SALES_AGENT)
  async remove(@Param('id') id: string) {
    const visitId = Number(id); // Convert id to number
    return this.visitService.removeVisit(visitId);
  }
}