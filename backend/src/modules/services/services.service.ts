import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({
      data,
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        category: true,
      },
    });
  }

  async findAll(filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    priceType?: string;
    onsite?: boolean;
    remote?: boolean;
    location?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'rating' | 'popularity' | 'price-low' | 'price-high';
  }) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      priceType,
      onsite,
      remote,
      location,
      limit = 20,
      offset = 0,
      sortBy = 'rating',
    } = filters || {};

    const where: Prisma.ServiceWhereInput = {};

    if (categoryId) where.categoryId = categoryId;
    if (minPrice && maxPrice) {
      where.basePrice = { gte: minPrice, lte: maxPrice };
    } else if (minPrice) {
      where.basePrice = { gte: minPrice };
    } else if (maxPrice) {
      where.basePrice = { lte: maxPrice };
    }
    if (priceType) where.priceType = priceType;
    if (typeof onsite === 'boolean') where.onsite = onsite;
    if (typeof remote === 'boolean') where.remote = remote;
    if (location) {
      where.OR = [
        { location: { contains: location } },
        { provider: { profile: { city: { contains: location } } } },
      ];
    }

    let orderBy: Prisma.ServiceOrderByWithRelationInput = { updatedAt: 'desc' };

    switch (sortBy) {
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'popularity':
        orderBy = { totalBookings: 'desc' };
        break;
      case 'price-low':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price-high':
        orderBy = { basePrice: 'desc' };
        break;
    }

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: {
          provider: {
            include: {
              profile: true,
            },
          },
          category: true,
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      total,
      limit,
      offset,
    };
  }

  async findById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        category: true,
      },
    });
  }

  async search(query: string, limit = 20, offset = 0) {
    const where: Prisma.ServiceWhereInput = {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { provider: { profile: { firstName: { contains: query } } } },
        { provider: { profile: { lastName: { contains: query } } } },
        { category: { name: { contains: query } } },
      ],
    };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        include: {
          provider: {
            include: {
              profile: true,
            },
          },
          category: true,
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      total,
      limit,
      offset,
    };
  }

  async getServicesByProvider(providerId: string) {
    return this.prisma.service.findMany({
      where: { provider: { id: providerId } },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getServiceReviews(serviceId: string, limit = 20, offset = 0) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { 
          booking: {
            serviceId,
          },
        },
        include: {
          fromUser: {
            include: {
              profile: true,
            },
          },
          toUser: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.review.count({
        where: { 
          booking: {
            serviceId,
          },
        },
      }),
    ]);

    return {
      data: reviews,
      total,
      limit,
      offset,
    };
  }

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return this.prisma.service.update({
      where: { id },
      data,
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        category: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
