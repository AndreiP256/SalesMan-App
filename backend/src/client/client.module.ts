import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

@Module({
    imports: [],
    providers: [ClientService],
    controllers: [ClientController],
    exports: [ClientService],
})
export class ClientModule {}