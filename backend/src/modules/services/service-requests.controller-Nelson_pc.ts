import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ServiceRequestsService } from './service-requests.service';
import { AiService } from '../ai/ai.service';

@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private serviceRequestsService: ServiceRequestsService,
    private aiService: AiService,
  ) {}

  /**
   * Get all service requests (for providers to see)
   */
  @Get()
  async getRequests(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    try {
      console.log('ServiceRequestsController: getRequests called');
      console.log('User:', user);
      
      // Pour le développement, permettre les requêtes sans auth
      const userId = user?.id || 'anonymous';
      
      const result = await this.serviceRequestsService.getRequests(
        userId,
        parseInt(limit),
        parseInt(offset)
      );
      console.log('ServiceRequestsController: returning', result.length, 'requests');
      return result;
    } catch (error: any) {
      console.error('ServiceRequestsController: Error in getRequests:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  /**
   * Get single service request details
   */
  @Get(':id')
  async getRequest(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    try {
      const userId = user?.id || 'anonymous';
      return await this.serviceRequestsService.getRequest(id, userId);
    } catch (error: any) {
      console.error('Error in getRequest:', error);
      return { error: error.message };
    }
  }

  /**
   * Create a new service request (customer creates)
   */
  @Post()
  async createRequest(
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    try {
      const userId = user?.id || 'anonymous';
      return await this.serviceRequestsService.createRequest(userId, body);
    } catch (error: any) {
      console.error('Error in createRequest:', error);
      return { error: error.message };
    }
  }

  /**
   * Apply to a service request (create booking)
   */
  @Post(':id/apply')
  async applyToRequest(
    @Param('id') requestId: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    try {
      const userId = user?.id || 'anonymous';
      return await this.serviceRequestsService.applyToRequest(requestId, userId, body);
    } catch (error: any) {
      console.error('Error in applyToRequest:', error);
      return { error: error.message };
    }
  }

  /**
   * Generate service request brief with AI
   */
  @Post('generate-brief')
  async generateBrief(
    @Body() body: { description: string; language?: string },
    @CurrentUser() user: any,
  ) {
    try {
      if (!body.description || body.description.trim().length === 0) {
        return { error: 'Description is required' };
      }

      const brief = await this.aiService.generateServiceBrief({
        description: body.description,
        language: body.language || 'fr',
      });

      return {
        success: true,
        brief,
      };
    } catch (error: any) {
      console.error('Error in generateBrief:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate brief',
      };
    }
  }

  /**
   * Refine a generated brief with user feedback
   */
  @Post('refine-brief')
  async refineBrief(
    @Body() body: {
      brief: any;
      feedback: string;
      language?: string;
    },
    @CurrentUser() user: any,
  ) {
    try {
      if (!body.brief || !body.feedback) {
        return { error: 'Brief and feedback are required' };
      }

      const refined = await this.aiService.refineBrief(
        body.brief,
        body.feedback,
        body.language || 'fr',
      );

      return {
        success: true,
        brief: refined,
      };
    } catch (error: any) {
      console.error('Error in refineBrief:', error);
      return {
        success: false,
        error: error.message || 'Failed to refine brief',
      };
    }
  }

  /**
   * Generate brief for homepage AI assistant
   */
  @Post('homepage/generate-brief')
  async generateHomePageBrief(
    @Body() body: { description: string },
  ) {
    try {
      console.log('🎯 generateHomePageBrief called with description:', body.description?.substring(0, 50));
      
      if (!body.description || body.description.trim().length === 0) {
        console.error('❌ Description is empty');
        return { success: false, error: 'Description is required' };
      }

      const brief = await this.aiService.generateHomePageBrief(
        body.description,
      );

      console.log('✅ Brief generated successfully:', brief.title);
      return {
        success: true,
        brief,
      };
    } catch (error: any) {
      console.error('❌ Error in generateHomePageBrief:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate brief',
      };
    }
  }

  /**
   * Generate services for homepage AI assistant
   */
  @Post('homepage/generate-services')
  async generateHomePageServices(
    @Body() body: { description: string },
  ) {
    try {
      console.log('🎯 generateHomePageServices called with description:', body.description?.substring(0, 50));
      
      if (!body.description || body.description.trim().length === 0) {
        console.error('❌ Description is empty');
        return { success: false, error: 'Description is required' };
      }

      const services = await this.aiService.generateHomePageServices(
        body.description,
      );

      console.log('✅ Services generated successfully:', services);
      return {
        success: true,
        services: services || [],
      };
    } catch (error: any) {
      console.error('❌ Error in generateHomePageServices:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate services',
      };
    }
  }
}
