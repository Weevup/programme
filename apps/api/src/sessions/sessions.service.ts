import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSessionInput,
  UpdateSessionInput,
  CreateSpeakerInput,
  SessionFeedbackInput,
} from '@event-platform/types';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionInput: CreateSessionInput) {
    const { startTime, endTime, eventId, venueRoomId } = createSessionInput;

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for room conflicts if venueRoomId is provided
    if (venueRoomId) {
      const conflicts = await this.prisma.session_Event.findMany({
        where: {
          eventId,
          venueRoomId,
          OR: [
            {
              AND: [
                { startTime: { lte: start } },
                { endTime: { gt: start } },
              ],
            },
            {
              AND: [
                { startTime: { lt: end } },
                { endTime: { gte: end } },
              ],
            },
            {
              AND: [
                { startTime: { gte: start } },
                { endTime: { lte: end } },
              ],
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new BadRequestException('Room is already booked for this time slot');
      }
    }

    return this.prisma.session_Event.create({
      data: createSessionInput,
      include: {
        venueRoom: true,
        speakers: true,
      },
    });
  }

  async findAllForEvent(eventId: string) {
    return this.prisma.session_Event.findMany({
      where: { eventId },
      orderBy: { startTime: 'asc' },
      include: {
        venueRoom: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        speakers: true,
        _count: {
          select: {
            checkIns: true,
            feedbacks: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.session_Event.findUnique({
      where: { id },
      include: {
        venueRoom: {
          include: {
            venue: true,
          },
        },
        speakers: {
          orderBy: { order: 'asc' },
        },
        documents: true,
        segments: {
          include: {
            segment: true,
          },
        },
        _count: {
          select: {
            checkIns: true,
            feedbacks: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Get average rating
    const feedbackStats = await this.prisma.sessionFeedback.aggregate({
      where: { sessionId: id },
      _avg: {
        rating: true,
      },
    });

    return {
      ...session,
      stats: {
        registeredCount: session._count.checkIns,
        checkedInCount: session._count.checkIns,
        averageRating: feedbackStats._avg.rating,
        feedbackCount: session._count.feedbacks,
      },
    };
  }

  async update(id: string, updateSessionInput: UpdateSessionInput) {
    await this.findOne(id);

    return this.prisma.session_Event.update({
      where: { id },
      data: updateSessionInput,
      include: {
        venueRoom: true,
        speakers: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.session_Event.delete({
      where: { id },
    });
  }

  // Speaker management
  async addSpeaker(createSpeakerInput: CreateSpeakerInput) {
    return this.prisma.speaker.create({
      data: createSpeakerInput,
    });
  }

  async updateSpeaker(speakerId: string, updateSpeakerInput: Partial<CreateSpeakerInput>) {
    return this.prisma.speaker.update({
      where: { id: speakerId },
      data: updateSpeakerInput,
    });
  }

  async removeSpeaker(speakerId: string) {
    return this.prisma.speaker.delete({
      where: { id: speakerId },
    });
  }

  // Feedback
  async addFeedback(feedbackInput: SessionFeedbackInput) {
    return this.prisma.sessionFeedback.create({
      data: feedbackInput,
    });
  }

  async getFeedbacks(sessionId: string) {
    return this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get conflicts for a session
  async checkConflicts(eventId: string, startTime: string, endTime: string, venueRoomId?: string, excludeSessionId?: string) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const where: any = {
      eventId,
      OR: [
        {
          AND: [
            { startTime: { lte: start } },
            { endTime: { gt: start } },
          ],
        },
        {
          AND: [
            { startTime: { lt: end } },
            { endTime: { gte: end } },
          ],
        },
        {
          AND: [
            { startTime: { gte: start } },
            { endTime: { lte: end } },
          ],
        },
      ],
    };

    if (venueRoomId) {
      where.venueRoomId = venueRoomId;
    }

    if (excludeSessionId) {
      where.id = { not: excludeSessionId };
    }

    return this.prisma.session_Event.findMany({
      where,
      include: {
        venueRoom: true,
        speakers: true,
      },
    });
  }
}
