import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('search')
  async search(@Query('q') query: string, @Query('limit') limit = '20', @Query('offset') offset = '0') {
    return this.servicesService.search(query, parseInt(limit), parseInt(offset));
  }

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('priceType') priceType?: string,
    @Query('onsite') onsite?: string,
    @Query('remote') remote?: string,
    @Query('location') location?: string,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
    @Query('sortBy') sortBy: 'rating' | 'popularity' | 'price-low' | 'price-high' = 'rating',
  ) {
    return this.servicesService.findAll({
      categoryId,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      priceType,
      onsite: onsite === 'true' ? true : onsite === 'false' ? false : undefined,
      remote: remote === 'true' ? true : remote === 'false' ? false : undefined,
      location,
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy,
    });
  }

  @Get(':id/reviews')
  async getServiceReviews(
    @Param('id') id: string,
    @Query('limit') limit = '20',
    @Query('offset') offset = '0',
  ) {
    return this.servicesService.getServiceReviews(id, parseInt(limit), parseInt(offset));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any, @CurrentUser() user: any) {
    return this.servicesService.create({
      ...data,
      providerId: user.id,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.servicesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
