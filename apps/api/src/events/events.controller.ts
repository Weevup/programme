import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateEventInput,
  UpdateEventInput,
  EventFilters,
  PaginationParams,
} from '@event-platform/types';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  create(@Body() createEventInput: CreateEventInput, @Request() req) {
    return this.eventsService.create(createEventInput, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events with filters and pagination' })
  findAll(@Query() filters: EventFilters, @Query() pagination: PaginationParams) {
    return this.eventsService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get event statistics' })
  getStats(@Param('id') id: string) {
    return this.eventsService.getStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  update(@Param('id') id: string, @Body() updateEventInput: UpdateEventInput) {
    return this.eventsService.update(id, updateEventInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
