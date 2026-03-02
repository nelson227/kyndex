import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.skillCategory.findMany({
      include: {
        skills: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.skillCategory.findUnique({
      where: { id },
      include: {
        skills: true,
        services: true,
      },
    });
  }

  async findByName(name: string) {
    return this.prisma.skillCategory.findFirst({
      where: { name },
      include: {
        skills: true,
      },
    });
  }

  async getTopCategories(limit = 9) {
    return this.prisma.skillCategory.findMany({
      include: {
        _count: {
          select: { services: true },
        },
        skills: true,
      },
      orderBy: {
        services: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }
}
