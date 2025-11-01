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
import { ParticipantsService } from './participants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateParticipantInput,
  UpdateParticipantInput,
  CheckInInput,
  CreateSegmentInput,
  ImportParticipantsInput,
  PaginationParams,
} from '@event-platform/types';

@ApiTags('participants')
@Controller('participants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new participant' })
  create(@Body() createParticipantInput: CreateParticipantInput) {
    return this.participantsService.create(createParticipantInput);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all participants for an event' })
  findAllForEvent(
    @Param('eventId') eventId: string,
    @Query() pagination: PaginationParams,
    @Query() filters?: any,
  ) {
    return this.participantsService.findAllForEvent(eventId, pagination, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single participant by ID' })
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(id);
  }

  @Get('qr/:qrCode')
  @ApiOperation({ summary: 'Get a participant by QR code' })
  findByQrCode(@Param('qrCode') qrCode: string) {
    return this.participantsService.findByQrCode(qrCode);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a participant' })
  update(@Param('id') id: string, @Body() updateParticipantInput: UpdateParticipantInput) {
    return this.participantsService.update(id, updateParticipantInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a participant' })
  remove(@Param('id') id: string) {
    return this.participantsService.remove(id);
  }

  // Import
  @Post('import')
  @ApiOperation({ summary: 'Import participants from CSV' })
  importFromCsv(@Body() importInput: ImportParticipantsInput) {
    return this.participantsService.importFromCsv(
      importInput.eventId,
      importInput.csvData,
      importInput.skipDuplicates,
    );
  }

  // Check-in
  @Post('check-in')
  @ApiOperation({ summary: 'Check-in a participant' })
  checkIn(@Body() checkInInput: CheckInInput) {
    return this.participantsService.checkIn(checkInInput);
  }

  @Get(':id/qr-code')
  @ApiOperation({ summary: 'Generate QR code image for a participant' })
  generateQrCode(@Param('id') id: string) {
    return this.participantsService.generateQrCodeImage(id);
  }

  // Segments
  @Post('segments')
  @ApiOperation({ summary: 'Create a new segment' })
  createSegment(@Body() createSegmentInput: CreateSegmentInput) {
    return this.participantsService.createSegment(createSegmentInput);
  }

  @Get('segments/event/:eventId')
  @ApiOperation({ summary: 'Get all segments for an event' })
  getSegments(@Param('eventId') eventId: string) {
    return this.participantsService.getSegments(eventId);
  }

  @Post(':participantId/segments/:segmentId')
  @ApiOperation({ summary: 'Add a participant to a segment' })
  addToSegment(@Param('participantId') participantId: string, @Param('segmentId') segmentId: string) {
    return this.participantsService.addParticipantToSegment(participantId, segmentId);
  }

  @Delete(':participantId/segments/:segmentId')
  @ApiOperation({ summary: 'Remove a participant from a segment' })
  removeFromSegment(@Param('participantId') participantId: string, @Param('segmentId') segmentId: string) {
    return this.participantsService.removeParticipantFromSegment(participantId, segmentId);
  }
}
