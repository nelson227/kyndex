import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@common/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MatchModule } from './modules/match/match.module';
import { ServicesModule } from './modules/services/services.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    MessagesModule,
    MatchModule,
    ServicesModule,
    CategoriesModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
