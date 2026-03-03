import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { TestController } from './test.controller';
import { PrismaModule } from '@/common/database/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ServicesController, ServiceRequestsController, TestController],
  providers: [ServicesService, ServiceRequestsService],
  exports: [ServicesService, ServiceRequestsService],
})
export class ServicesModule {}
