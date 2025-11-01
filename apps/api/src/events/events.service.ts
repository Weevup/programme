import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEventInput,
  UpdateEventInput,
  EventFilters,
  PaginationParams,
} from '@event-platform/types';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventInput: CreateEventInput, userId: string) {
    return this.prisma.event.create({
      data: {
        ...createEventInput,
        createdById: userId,
        budgetTotal: createEventInput.budgetTotal
          ? String(createEventInput.budgetTotal)
          : null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filters: EventFilters, pagination: PaginationParams) {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDateFrom) {
      where.startDate = {
        ...where.startDate,
        gte: new Date(filters.startDateFrom),
      };
    }

    if (filters.startDateTo) {
      where.startDate = {
        ...where.startDate,
        lte: new Date(filters.startDateTo),
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { startDate: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              participants: true,
              sessions: true,
              venues: true,
            },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        venues: {
          include: {
            venue: {
              include: {
                rooms: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
            sessions: true,
            checkIns: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    // Check if event exists
    await this.findOne(id);

    return this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventInput,
        budgetTotal: updateEventInput.budgetTotal
          ? String(updateEventInput.budgetTotal)
          : undefined,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if event exists
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }

  async getStats(id: string) {
    const event = await this.findOne(id);

    const [
      totalParticipants,
      totalSessions,
      totalCheckIns,
      totalVenues,
      participantsByStatus,
      sessionsByType,
    ] = await Promise.all([
      this.prisma.participant.count({ where: { eventId: id } }),
      this.prisma.session_Event.count({ where: { eventId: id } }),
      this.prisma.checkIn.count({ where: { eventId: id } }),
      this.prisma.eventVenue.count({ where: { eventId: id } }),
      this.prisma.participant.groupBy({
        by: ['status'],
        where: { eventId: id },
        _count: true,
      }),
      this.prisma.session_Event.groupBy({
        by: ['type'],
        where: { eventId: id },
        _count: true,
      }),
    ]);

    return {
      event,
      stats: {
        totalParticipants,
        totalSessions,
        totalCheckIns,
        totalVenues,
        participantsByStatus,
        sessionsByType,
      },
    };
  }
}
