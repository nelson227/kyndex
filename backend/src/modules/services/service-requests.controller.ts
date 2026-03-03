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
   * Generate a brief using AI from user description
   */
  @Post('generate-brief')
  async generateBrief(@Body() body: any) {
    try {
      const { description, language = 'fr' } = body;
      
      if (!description || !description.trim()) {
        return {
          success: false,
          error: 'Description is required',
        };
      }

      const brief = await this.aiService.generateServiceBrief({
        description,
        language,
      });

      return {
        success: true,
        brief,
      };
    } catch (error: any) {
      console.error('Error generating brief:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate brief',
      };
    }
  }

  /**
   * Refine an existing brief based on feedback
   */
  @Post('refine-brief')
  async refineBrief(@Body() body: any) {
    try {
      const { brief, feedback, language = 'fr' } = body;
      
      if (!brief || !feedback || !feedback.trim()) {
        return {
          success: false,
          error: 'Brief and feedback are required',
        };
      }

      const refinedBrief = await this.aiService.refineBrief(brief, feedback, language);

      return {
        success: true,
        brief: refinedBrief,
      };
    } catch (error: any) {
      console.error('Error refining brief:', error);
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
  async generateHomepageBrief(@Body() body: any) {
    try {
      const { description, language = 'fr' } = body;
      
      if (!description || !description.trim()) {
        return {
          success: false,
          error: 'Description is required',
        };
      }

      const brief = await this.aiService.generateServiceBrief({
        description,
        language,
      });

      return {
        success: true,
        brief,
      };
    } catch (error: any) {
      console.error('Error generating homepage brief:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate brief',
      };
    }
  }

  /**
   * Generate services list based on brief for homepage
   */
  @Post('homepage/generate-services')
  async generateHomepageServices(@Body() body: any) {
    try {
      // Accept either 'brief' object or 'description' string
      const description = body.brief?.description || body.description || '';
      const language = body.language || 'fr';
      
      if (!description) {
        return {
          success: false,
          error: 'Brief description or description is required',
        };
      }

      // Generate services based on the description using AI
      const services = await this.aiService.generateHomePageServices(description);

      return {
        success: true,
        services,
      };
    } catch (error: any) {
      console.error('Error generating homepage services:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate services',
      };
    }
  }
}
