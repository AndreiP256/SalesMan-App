import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';

@Module({
    imports: [],
    providers: [DriverService],
    controllers: [DriverController],
    exports: [DriverService],
})
export class DriverModule {}