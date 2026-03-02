import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput) {
    return this.prisma.booking.create({
      data,
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: {
          include: {
            category: true,
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(filters?: {
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { userId, status, limit = 20, offset = 0 } = filters || {};

    const where: Prisma.BookingWhereInput = {};

    if (userId) {
      where.OR = [{ customerId: userId }, { service: { provider: { id: userId } } }];
    }

    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          customer: {
            include: {
              profile: true,
            },
          },
          service: {
            include: {
              category: true,
              provider: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledDate: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      total,
      limit,
      offset,
    };
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: {
          include: {
            category: true,
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async cancel(id: string) {
    return this.updateStatus(id, 'CANCELLED');
  }

  async complete(id: string) {
    return this.updateStatus(id, 'COMPLETED');
  }

  async getUserBookings(userId: string, role: 'customer' | 'provider' | 'both' = 'both') {
    const where: any = {};

    if (role === 'customer') {
      where.customerId = userId;
    } else if (role === 'provider') {
      where.service = { provider: { id: userId } };
    } else {
      where.OR = [{ customerId: userId }, { service: { provider: { id: userId } } }];
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: {
          include: {
            category: true,
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }
}
