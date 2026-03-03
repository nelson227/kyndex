import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('test')
export class TestController {
  @Get('health')
  health() {
    return { status: 'OK' };
  }

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  testAuth(@CurrentUser() user: any) {
    return { 
      status: 'Authenticated', 
      userId: user.id,
      email: user.email 
    };
  }
}
