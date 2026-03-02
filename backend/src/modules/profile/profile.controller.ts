import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Get current user profile',
  })
  async getProfile(@CurrentUser() user: any) {
    return this.profileService.getProfile(user.id);
  }

  @Put('me')
  @ApiResponse({
    status: 200,
    description: 'Update user profile',
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body()
    data: {
      firstName?: string;
      lastName?: string;
      bio?: string;
      location?: string;
      languages?: string;
      availability?: string;
    },
  ) {
    return this.profileService.updateProfile(user.id, data);
  }

  @Post('complete-setup')
  @ApiResponse({
    status: 200,
    description: 'Complete profile setup (onboarding)',
  })
  async completeSetup(
    @CurrentUser() user: any,
    @Body()
    data: {
      firstName: string;
      lastName: string;
      bio: string;
      location: string;
    },
  ) {
    if (!data.firstName || !data.lastName || !data.bio || !data.location) {
      throw new BadRequestException('Missing required fields');
    }
    return this.profileService.completeProfileSetup(user.id, data);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 200,
    description: 'Upload avatar',
  })
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate image type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.profileService.uploadAvatar(user.id, file);
  }

  @Post('portfolio')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @ApiResponse({
    status: 200,
    description: 'Upload portfolio images',
  })
  async uploadPortfolioImages(
    @CurrentUser() user: any,
    @UploadedFiles() files: any[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    // Validate all files are images
    if (!files.every((f) => f.mimetype.startsWith('image/'))) {
      throw new BadRequestException('All files must be images');
    }

    return this.profileService.uploadPortfolioImages(user.id, files);
  }

  @Delete('portfolio/:imageId')
  @ApiResponse({
    status: 200,
    description: 'Delete portfolio image',
  })
  async deletePortfolioImage(
    @CurrentUser() user: any,
    @Param('imageId') imageId: string,
  ) {
    return this.profileService.deletePortfolioImage(user.id, imageId);
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Search profiles by keywords and location',
  })
  async searchProfiles(
    @CurrentUser() user: any,
    @Query('q') query?: string,
    @Query('location') location?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    return this.profileService.searchProfiles(user.id, query, location, skip, limitNum);
  }

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'Get public profile by user ID',
  })
  async getPublicProfile(@Param('userId') userId: string) {
    return this.profileService.getFullUserProfile(userId);
  }

  @Get(':userId/services')
  @ApiResponse({
    status: 200,
    description: 'Get all services by a provider',
  })
  async getUserServices(@Param('userId') userId: string) {
    return this.profileService.getUserServices(userId);
  }

  @Get(':userId/reviews')
  @ApiResponse({
    status: 200,
    description: 'Get all reviews for a user',
  })
  async getUserReviews(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
  ) {
    return this.profileService.getUserReviews(userId, parseInt(limit), parseInt(offset));
  }
}
