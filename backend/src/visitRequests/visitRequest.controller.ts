import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { VisitRequestService } from './visitRequest.service';
import { VisitRequest } from '@prisma/client';
import { Auth } from 'src/login/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateVisitRequestDto} from './dto/visitRequest.dto';

@Controller('visitRequest')
export class VisitRequestController {
constructor(private readonly visitRequestService: VisitRequestService) {}

@Post()
@Auth(UserRole.MANAGER)
async create(@Body() createVisitRequestDto: Prisma.VisitRequestCreateInput & { userId: number, clientId: number, salesAgentId: number }) {
    return this.visitRequestService.createVisitRequest(createVisitRequestDto);
}

  @Get()
  async findAll() {
      return this.visitRequestService.findAllVisitRequests();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const visitRequestId = Number(id); // Convert id to number
    return this.visitRequestService.findOneVisitRequest(visitRequestId);
  }

  @Get('user/:userId')
  async findVistRequestsByUser(@Param('userId') userId: string) {
    const parsedUserId = Number(userId); // Convert userId to number
    return this.visitRequestService.findVistRequestsByUser(parsedUserId);
  }

  @Delete(':id')
  @Auth(UserRole.MANAGER, UserRole.SALES_AGENT)
  async remove(@Param('id') id: string) {
    const visitRequestId = Number(id); // Convert id to number
    return this.visitRequestService.removeVisitRequest(visitRequestId);
  }
}