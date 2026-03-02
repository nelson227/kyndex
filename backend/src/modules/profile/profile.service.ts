import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ProfileService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    // Ensure uploads directory exists
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}${path.extname(originalName)}`;
  }

  async saveFile(file: any, subfolder: string): Promise<string> {
    const filename = this.generateFileName(file.originalname);
    const filepath = path.join(this.uploadDir, subfolder);
    
    // Ensure subfolder exists
    await fs.mkdir(filepath, { recursive: true });
    
    const fullpath = path.join(filepath, filename);
    await fs.writeFile(fullpath, file.buffer);
    
    // Return relative path for serving
    return `/uploads/${subfolder}/${filename}`;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        portfolioImages: {
          orderBy: { createdAt: 'desc' },
        },
      } as any,
    });

    if (!profile) {
      // Create empty profile if it doesn't exist
      return await this.prisma.profile.create({
        data: { userId },
        include: {
          portfolioImages: true,
        } as any,
      });
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    data: any,
  ) {
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await this.prisma.profile.create({
        data: { userId, ...data },
      });
    } else {
      const updateData: any = {};
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.languages !== undefined) updateData.languages = data.languages;
      if (data.availability !== undefined) updateData.availability = data.availability;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      
      if (Object.keys(updateData).length > 0) {
        profile = await this.prisma.profile.update({
          where: { userId },
          data: updateData,
        });
      }
    }

    return profile;
  }

  async uploadAvatar(userId: string, file: any) {
    const avatarUrl = await this.saveFile(file, 'avatars');

    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await this.prisma.profile.create({
        data: { userId },
      });
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        avatarUrl: avatarUrl,
      } as any,
    });
    
    return { avatarUrl, profile: updatedProfile };
  }

  async uploadPortfolioImages(
    userId: string,
    files: any[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const portfolioImages: any[] = [];
    for (const file of files) {
      const imageUrl = await this.saveFile(file, 'portfolio');
      const img = await (this.prisma as any).portfolioImage.create({
        data: {
          profileId: profile.id,
          imageUrl,
          title: file.originalname.split('.')[0],
        },
      });
      portfolioImages.push(img);
    }

    return portfolioImages;
  }

  async deletePortfolioImage(userId: string, imageId: string) {
    const image = await (this.prisma as any).portfolioImage.findUnique({
      where: { id: imageId },
      include: { profile: true },
    });

    if (!image || image.profile.userId !== userId) {
      throw new BadRequestException('Unauthorized to delete this image');
    }

    // Delete file from filesystem
    const filepath = path.join(process.cwd(), image.imageUrl.replace(/^\//, ''));
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.warn('Could not delete file:', filepath);
    }

    await (this.prisma as any).portfolioImage.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }

  async completeProfileSetup(userId: string, data: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  }) {
    // First ensure profile exists
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      location: data.location,
      isProfileComplete: true,
    };

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: {
          userId,
          ...updateData,
        },
      });
    } else {
      profile = await this.prisma.profile.update({
        where: { userId },
        data: updateData,
      });
    }

    return profile;
  }

  async searchProfiles(currentUserId: string, query?: string, location?: string, skip = 0, take = 10) {
    const where: any = {
      isProfileComplete: true,
      userId: { not: currentUserId }, // Exclude current user
    };

    if (query) {
      where.OR = [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { bio: { contains: query } },
      ];
    }

    if (location) {
      where.location = { contains: location };
    }

    const profiles = await this.prisma.profile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true } },
        portfolioImages: true,
      } as any,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.profile.count({ where });

    return {
      profiles,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  async getUserServices(userId: string) {
    return this.prisma.service.findMany({
      where: { provider: { id: userId } },
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

  async getUserReviews(userId: string, limit = 20, offset = 0) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { 
          toUserId: userId,
        },
        include: {
          fromUser: {
            include: {
              profile: true,
            },
          },
          booking: {
            include: {
              service: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.review.count({
        where: { 
          toUserId: userId,
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

  async getFullUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) return null;

    // Get user's services and badges
    const [services, badges, reviews] = await Promise.all([
      this.prisma.service.findMany({
        where: { provider: { id: userId } },
        include: {
          category: true,
        },
      }),
      this.prisma.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
      }),
      this.prisma.review.findMany({
        where: { toUserId: userId },
        include: {
          fromUser: {
            include: {
              profile: true,
            },
          },
        },
      }),
    ]);

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
      : 0;

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
      badges,
      services,
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    };
  }
}
