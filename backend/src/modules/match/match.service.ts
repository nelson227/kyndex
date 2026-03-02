import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async getMutualMatches(userId: string) {
    const mutualMatches = await (this.prisma as any).match.findMany({
      where: {
        AND: [
          {
            OR: [
              { userAId: userId },
              { userBId: userId },
            ],
          },
          { status: 'MATCHED' },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                bio: true,
                location: true,
                avatarUrl: true,
                reputationScore: true,
              },
            },
          },
        },
        userB: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                bio: true,
                location: true,
                avatarUrl: true,
                reputationScore: true,
              },
            },
          },
        },
      },
    });

    return mutualMatches.map((match: any) => {
      return {
        id: match.id,
        userA: match.userA,
        userB: match.userB,
        status: match.status,
      };
    });
  }

  async likeUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot like yourself');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Check if match already exists
    const existingMatch = await (this.prisma as any).match.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: targetUserId },
          { userAId: targetUserId, userBId: userId },
        ],
      },
    });

    if (existingMatch) {
      if (existingMatch.status === 'MATCHED') {
        return { message: 'Already matched', status: 'MATCHED' };
      }

      // Check if this creates a mutual match
      if (
        (existingMatch.userAId === targetUserId && existingMatch.status === 'PENDING') ||
        (existingMatch.userBId === targetUserId && existingMatch.status === 'PENDING')
      ) {
        // Mutual match!
        const updatedMatch = await (this.prisma as any).match.update({
          where: { id: existingMatch.id },
          data: { status: 'MATCHED' },
        });
        return { message: 'Mutual match!', status: 'MATCHED' };
      }
    }

    // Create new match
    const match = await (this.prisma as any).match.create({
      data: {
        userAId: userId,
        userBId: targetUserId,
        status: 'PENDING',
      },
    });

    return { message: 'Like sent', status: 'PENDING' };
  }

  async rejectUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot reject yourself');
    }

    // Check if match exists
    const existingMatch = await (this.prisma as any).match.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: targetUserId },
          { userAId: targetUserId, userBId: userId },
        ],
      },
    });

    if (!existingMatch) {
      // Create rejected match
      await (this.prisma as any).match.create({
        data: {
          userAId: userId,
          userBId: targetUserId,
          status: 'REJECTED',
        },
      });
      return { message: 'User rejected' };
    }

    if (existingMatch.status === 'REJECTED') {
      return { message: 'Already rejected' };
    }

    // Update status to rejected
    await (this.prisma as any).match.update({
      where: { id: existingMatch.id },
      data: { status: 'REJECTED' },
    });

    return { message: 'User rejected' };
  }
}
