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
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateVenueInput,
  UpdateVenueInput,
  CreateVenueRoomInput,
  VenueSearchFilters,
  PaginationParams,
} from '@event-platform/types';

@ApiTags('venues')
@Controller('venues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new venue' })
  create(@Body() createVenueInput: CreateVenueInput) {
    return this.venuesService.create(createVenueInput);
  }

  @Get()
  @ApiOperation({ summary: 'Search venues with filters' })
  findAll(@Query() filters: VenueSearchFilters, @Query() pagination: PaginationParams) {
    return this.venuesService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single venue by ID' })
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a venue' })
  update(@Param('id') id: string, @Body() updateVenueInput: UpdateVenueInput) {
    return this.venuesService.update(id, updateVenueInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a venue' })
  remove(@Param('id') id: string) {
    return this.venuesService.remove(id);
  }

  // Room endpoints
  @Post(':id/rooms')
  @ApiOperation({ summary: 'Add a room to a venue' })
  addRoom(@Param('id') venueId: string, @Body() createRoomInput: CreateVenueRoomInput) {
    return this.venuesService.addRoom(venueId, createRoomInput);
  }

  @Patch('rooms/:roomId')
  @ApiOperation({ summary: 'Update a venue room' })
  updateRoom(@Param('roomId') roomId: string, @Body() updateRoomInput: Partial<CreateVenueRoomInput>) {
    return this.venuesService.updateRoom(roomId, updateRoomInput);
  }

  @Delete('rooms/:roomId')
  @ApiOperation({ summary: 'Delete a venue room' })
  removeRoom(@Param('roomId') roomId: string) {
    return this.venuesService.removeRoom(roomId);
  }
}
