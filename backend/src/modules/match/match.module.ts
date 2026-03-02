import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
