import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MatchService } from './match.service';

@ApiTags('Match')
@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get('mutual')
  @ApiResponse({
    status: 200,
    description: 'Get all mutual matches for current user',
  })
  async getMutualMatches(@CurrentUser() user: any) {
    return this.matchService.getMutualMatches(user.id);
  }

  @Post('like')
  @ApiResponse({
    status: 200,
    description: 'Like/match with a user',
  })
  async likeUser(
    @CurrentUser() user: any,
    @Body() data: { targetUserId: string },
  ) {
    if (!data.targetUserId) {
      throw new BadRequestException('targetUserId is required');
    }
    return this.matchService.likeUser(user.id, data.targetUserId);
  }

  @Post('reject')
  @ApiResponse({
    status: 200,
    description: 'Reject a user',
  })
  async rejectUser(
    @CurrentUser() user: any,
    @Body() data: { targetUserId: string },
  ) {
    if (!data.targetUserId) {
      throw new BadRequestException('targetUserId is required');
    }
    return this.matchService.rejectUser(user.id, data.targetUserId);
  }
}
