import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateSessionInput,
  UpdateSessionInput,
  CreateSpeakerInput,
  SessionFeedbackInput,
} from '@event-platform/types';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  create(@Body() createSessionInput: CreateSessionInput) {
    return this.sessionsService.create(createSessionInput);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all sessions for an event' })
  findAllForEvent(@Param('eventId') eventId: string) {
    return this.sessionsService.findAllForEvent(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single session by ID' })
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session' })
  update(@Param('id') id: string, @Body() updateSessionInput: UpdateSessionInput) {
    return this.sessionsService.update(id, updateSessionInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session' })
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }

  // Speaker endpoints
  @Post('speakers')
  @ApiOperation({ summary: 'Add a speaker to a session' })
  addSpeaker(@Body() createSpeakerInput: CreateSpeakerInput) {
    return this.sessionsService.addSpeaker(createSpeakerInput);
  }

  @Patch('speakers/:speakerId')
  @ApiOperation({ summary: 'Update a speaker' })
  updateSpeaker(@Param('speakerId') speakerId: string, @Body() updateSpeakerInput: Partial<CreateSpeakerInput>) {
    return this.sessionsService.updateSpeaker(speakerId, updateSpeakerInput);
  }

  @Delete('speakers/:speakerId')
  @ApiOperation({ summary: 'Delete a speaker' })
  removeSpeaker(@Param('speakerId') speakerId: string) {
    return this.sessionsService.removeSpeaker(speakerId);
  }

  // Feedback endpoints
  @Post('feedback')
  @ApiOperation({ summary: 'Add feedback for a session' })
  addFeedback(@Body() feedbackInput: SessionFeedbackInput) {
    return this.sessionsService.addFeedback(feedbackInput);
  }

  @Get(':id/feedbacks')
  @ApiOperation({ summary: 'Get all feedbacks for a session' })
  getFeedbacks(@Param('id') sessionId: string) {
    return this.sessionsService.getFeedbacks(sessionId);
  }

  // Conflict detection
  @Get('conflicts/check')
  @ApiOperation({ summary: 'Check for session conflicts' })
  checkConflicts(
    @Query('eventId') eventId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('venueRoomId') venueRoomId?: string,
    @Query('excludeSessionId') excludeSessionId?: string,
  ) {
    return this.sessionsService.checkConflicts(eventId, startTime, endTime, venueRoomId, excludeSessionId);
  }
}
