import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.bookingsService.create({
      ...data,
      customerId: user.id,
    });
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
  ) {
    return this.bookingsService.findAll({
      userId: user.id,
      status,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() data: { status: string }) {
    return this.bookingsService.updateStatus(id, data.status);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }

  @Put(':id/complete')
  async complete(@Param('id') id: string) {
    return this.bookingsService.complete(id);
  }

  @Get('user/:userId')
  async getUserBookings(
    @Param('userId') userId: string,
    @Query('role') role: 'customer' | 'provider' | 'both' = 'both',
  ) {
    return this.bookingsService.getUserBookings(userId, role);
  }
}
