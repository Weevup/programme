import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVenueInput,
  UpdateVenueInput,
  CreateVenueRoomInput,
  VenueSearchFilters,
  PaginationParams,
} from '@event-platform/types';

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  async create(createVenueInput: CreateVenueInput) {
    return this.prisma.venue.create({
      data: {
        ...createVenueInput,
        latitude: createVenueInput.latitude ? String(createVenueInput.latitude) : null,
        longitude: createVenueInput.longitude ? String(createVenueInput.longitude) : null,
      },
    });
  }

  async findAll(filters: VenueSearchFilters, pagination: PaginationParams) {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { city: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.country) {
      where.country = { contains: filters.country, mode: 'insensitive' };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.minCapacity) {
      where.totalCapacity = {
        ...where.totalCapacity,
        gte: filters.minCapacity,
      };
    }

    if (filters.maxCapacity) {
      where.totalCapacity = {
        ...where.totalCapacity,
        lte: filters.maxCapacity,
      };
    }

    if (filters.minRseScore) {
      where.rseScore = {
        gte: filters.minRseScore,
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [venues, total] = await Promise.all([
      this.prisma.venue.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          rooms: true,
          _count: {
            select: {
              events: true,
            },
          },
        },
      }),
      this.prisma.venue.count({ where }),
    ]);

    return {
      data: venues,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: {
        rooms: true,
        media: true,
        events: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
      },
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }

    return venue;
  }

  async update(id: string, updateVenueInput: UpdateVenueInput) {
    await this.findOne(id);

    return this.prisma.venue.update({
      where: { id },
      data: {
        ...updateVenueInput,
        latitude: updateVenueInput.latitude ? String(updateVenueInput.latitude) : undefined,
        longitude: updateVenueInput.longitude ? String(updateVenueInput.longitude) : undefined,
      },
      include: {
        rooms: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.venue.delete({
      where: { id },
    });
  }

  // Room management
  async addRoom(venueId: string, createRoomInput: CreateVenueRoomInput) {
    // Check if venue exists
    await this.findOne(venueId);

    return this.prisma.venueRoom.create({
      data: {
        ...createRoomInput,
        venueId,
        area: createRoomInput.area ? String(createRoomInput.area) : null,
      },
    });
  }

  async updateRoom(roomId: string, updateRoomInput: Partial<CreateVenueRoomInput>) {
    return this.prisma.venueRoom.update({
      where: { id: roomId },
      data: {
        ...updateRoomInput,
        area: updateRoomInput.area ? String(updateRoomInput.area) : undefined,
      },
    });
  }

  async removeRoom(roomId: string) {
    return this.prisma.venueRoom.delete({
      where: { id: roomId },
    });
  }
}
