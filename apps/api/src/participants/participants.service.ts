import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import {
  CreateParticipantInput,
  UpdateParticipantInput,
  CheckInInput,
  CreateSegmentInput,
  PaginationParams,
} from '@event-platform/types';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  async create(createParticipantInput: CreateParticipantInput) {
    // Check for duplicate
    const existing = await this.prisma.participant.findUnique({
      where: {
        eventId_email: {
          eventId: createParticipantInput.eventId,
          email: createParticipantInput.email,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Participant with this email already exists for this event');
    }

    return this.prisma.participant.create({
      data: {
        ...createParticipantInput,
        consentDate: createParticipantInput.consentData ? new Date() : null,
      },
    });
  }

  async findAllForEvent(eventId: string, pagination: PaginationParams, filters?: any) {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const where: any = { eventId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [participants, total] = await Promise.all([
      this.prisma.participant.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { registeredAt: 'desc' },
        include: {
          segments: {
            include: {
              segment: true,
            },
          },
          _count: {
            select: {
              checkIns: true,
            },
          },
        },
      }),
      this.prisma.participant.count({ where }),
    ]);

    return {
      data: participants,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
          },
        },
        segments: {
          include: {
            segment: true,
          },
        },
        checkIns: {
          include: {
            session: {
              select: {
                id: true,
                title: true,
                startTime: true,
              },
            },
          },
          orderBy: { checkInTime: 'desc' },
        },
        feedbacks: {
          include: {
            session: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!participant) {
      throw new NotFoundException(`Participant with ID ${id} not found`);
    }

    return participant;
  }

  async findByQrCode(qrCode: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { qrCode },
      include: {
        event: true,
      },
    });

    if (!participant) {
      throw new NotFoundException(`Participant with QR code not found`);
    }

    return participant;
  }

  async update(id: string, updateParticipantInput: UpdateParticipantInput) {
    await this.findOne(id);

    return this.prisma.participant.update({
      where: { id },
      data: updateParticipantInput,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.participant.delete({
      where: { id },
    });
  }

  // Import from CSV
  async importFromCsv(eventId: string, csvData: string, skipDuplicates: boolean = true) {
    // Parse CSV (simple implementation - could use a library like csv-parse)
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const participants = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const participant: any = { eventId };

      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase()) {
          case 'email':
            participant.email = value;
            break;
          case 'firstname':
          case 'first_name':
            participant.firstName = value;
            break;
          case 'lastname':
          case 'last_name':
            participant.lastName = value;
            break;
          case 'company':
            participant.company = value;
            break;
          case 'jobtitle':
          case 'job_title':
            participant.jobTitle = value;
            break;
          case 'phone':
            participant.phone = value;
            break;
        }
      });

      if (!participant.email || !participant.firstName || !participant.lastName) {
        errors.push({ line: i + 1, error: 'Missing required fields' });
        continue;
      }

      try {
        const existing = await this.prisma.participant.findUnique({
          where: {
            eventId_email: {
              eventId,
              email: participant.email,
            },
          },
        });

        if (existing && skipDuplicates) {
          continue;
        }

        const created = await this.prisma.participant.create({
          data: participant,
        });

        participants.push(created);
      } catch (error) {
        errors.push({ line: i + 1, email: participant.email, error: error.message });
      }
    }

    return {
      imported: participants.length,
      errors: errors.length,
      participants,
      errorDetails: errors,
    };
  }

  // Check-in
  async checkIn(checkInInput: CheckInInput) {
    let participant;

    if (checkInInput.participantId) {
      participant = await this.findOne(checkInInput.participantId);
    } else if (checkInInput.qrCode) {
      participant = await this.findByQrCode(checkInInput.qrCode);
    } else {
      throw new NotFoundException('Either participantId or qrCode must be provided');
    }

    // Create check-in record
    const checkIn = await this.prisma.checkIn.create({
      data: {
        eventId: checkInInput.eventId,
        participantId: participant.id,
        sessionId: checkInInput.sessionId,
        location: checkInInput.location,
        checkInType: checkInInput.sessionId ? 'SESSION' : 'EVENT',
      },
    });

    // Update participant status
    await this.prisma.participant.update({
      where: { id: participant.id },
      data: {
        status: 'CHECKED_IN',
      },
    });

    return {
      checkIn,
      participant,
    };
  }

  // Generate QR code image
  async generateQrCodeImage(participantId: string): Promise<string> {
    const participant = await this.findOne(participantId);
    return QRCode.toDataURL(participant.qrCode);
  }

  // Segments
  async createSegment(createSegmentInput: CreateSegmentInput) {
    return this.prisma.segment.create({
      data: createSegmentInput,
    });
  }

  async getSegments(eventId: string) {
    return this.prisma.segment.findMany({
      where: { eventId },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });
  }

  async addParticipantToSegment(participantId: string, segmentId: string) {
    return this.prisma.participantSegment.create({
      data: {
        participantId,
        segmentId,
      },
    });
  }

  async removeParticipantFromSegment(participantId: string, segmentId: string) {
    return this.prisma.participantSegment.delete({
      where: {
        participantId_segmentId: {
          participantId,
          segmentId,
        },
      },
    });
  }
}
