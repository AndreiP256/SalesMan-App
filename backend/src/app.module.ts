import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitModule } from './visit/visit.module';
import { DriverModule } from './driver/driver.module';
import { ManagerModule } from './manager/manager.module';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { ClientModule } from './client/client.module';
import { SalesAgentModule } from './sales-agent/sales-agent.module';
import { JwtStrategy } from './login/strategies/jwt.strategy';
import { VisitRequestModule } from './visitRequests/visitRequest.module';

@Module({
  imports: [VisitModule, DriverModule, ManagerModule, UserModule, LoginModule, ClientModule, SalesAgentModule, VisitRequestModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
