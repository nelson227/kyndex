import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  async getRequests(userId: string, limit = 50, offset = 0) {
    try {
      const requests = await (this.prisma as any).serviceRequest.findMany({
        include: {
          customer: {
            include: { profile: true },
          },
          bookings: {
            include: {
              provider: { include: { profile: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      // Enrich with status for current provider
      return requests.map((req: any) => {
        const currentProviderBooking = req.bookings.find(
          (b: any) => b.providerId === userId
        );

        let statusForProvider = 'NOUVEAU';
        if (currentProviderBooking) {
          statusForProvider = 'A_VALIDER';
        } else if (req.bookings.length > 0) {
          statusForProvider = 'EN_ATTENTE';
        }

        return {
          ...req,
          statusForProvider,
        };
      });
    } catch (error) {
      console.error('Error in getRequests:', error);
      return [];
    }
  }

  async getRequest(id: string, userId: string) {
    try {
      const request = await (this.prisma as any).serviceRequest.findUnique({
        where: { id },
        include: {
          customer: {
            include: { profile: true },
          },
          bookings: {
            include: {
              provider: { include: { profile: true } },
            },
          },
        },
      });

      if (!request) {
        throw new Error('Service request not found');
      }

      const currentProviderBooking = request.bookings.find(
        (b: any) => b.providerId === userId
      );

      let statusForProvider = 'NOUVEAU';
      if (currentProviderBooking) {
        statusForProvider = 'A_VALIDER';
      } else if (request.bookings.length > 0) {
        statusForProvider = 'EN_ATTENTE';
      }

      return {
        ...request,
        statusForProvider,
      };
    } catch (error) {
      console.error('Error in getRequest:', error);
      throw error;
    }
  }

  async createRequest(userId: string, data: any) {
    try {
      const request = await (this.prisma as any).serviceRequest.create({
        data: {
          customerId: userId,
          title: data.title,
          description: data.description,
          budget: data.budget,
          currency: data.currency || 'EUR',
          categoryId: data.categoryId,
          requiredSkills: data.requiredSkills,
          location: data.location,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
        include: {
          customer: { include: { profile: true } },
        },
      });

      return request;
    } catch (error) {
      console.error('Error in createRequest:', error);
      throw error;
    }
  }

  async applyToRequest(requestId: string, userId: string, data: any) {
    try {
      const request = await (this.prisma as any).serviceRequest.findUnique({
        where: { id: requestId },
        include: { bookings: true },
      });

      if (!request) {
        throw new Error('Service request not found');
      }

      // Check if provider already applied
      const existingBooking = request.bookings.find(
        (b: any) => b.providerId === userId
      );
      if (existingBooking) {
        throw new Error('You already applied to this request');
      }

      const booking = await (this.prisma as any).booking.create({
        data: {
          serviceRequestId: requestId,
          providerId: userId,
          customerId: request.customerId,
          status: 'PENDING',
          totalPrice: data.proposedPrice,
          currency: data.currency || request.currency || 'EUR',
        },
        include: {
          provider: { include: { profile: true } },
          customer: { include: { profile: true } },
        },
      });

      return booking;
    } catch (error) {
      console.error('Error in applyToRequest:', error);
      throw error;
    }
  }
}
