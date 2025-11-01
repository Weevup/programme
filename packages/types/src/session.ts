import { z } from 'zod';

export enum SessionType {
  PLENARY = 'PLENARY',
  WORKSHOP = 'WORKSHOP',
  BREAK = 'BREAK',
  MEAL = 'MEAL',
  NETWORKING = 'NETWORKING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}

export enum SessionStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Create Session
export const createSessionSchema = z.object({
  eventId: z.string().cuid(),
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  type: z.nativeEnum(SessionType),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  venueRoomId: z.string().cuid().optional(),
  location: z.string().optional(),
  maxCapacity: z.number().int().positive().optional(),
  isPublic: z.boolean().default(true),
  language: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// Update Session
export const updateSessionSchema = createSessionSchema.partial().extend({
  status: z.nativeEnum(SessionStatus).optional(),
  notes: z.string().optional(),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

// Speaker
export const createSpeakerSchema = z.object({
  sessionId: z.string().cuid(),
  name: z.string().min(2),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  photo: z.string().url().optional(),
  email: z.string().email().optional(),
  order: z.number().int().default(0),
});

export type CreateSpeakerInput = z.infer<typeof createSpeakerSchema>;

// Session Feedback
export const sessionFeedbackSchema = z.object({
  sessionId: z.string().cuid(),
  participantId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type SessionFeedbackInput = z.infer<typeof sessionFeedbackSchema>;

// Response types
export interface Session {
  id: string;
  eventId: string;
  title: string;
  description: string | null;
  type: SessionType;
  startTime: Date;
  endTime: Date;
  venueRoomId: string | null;
  location: string | null;
  maxCapacity: number | null;
  isPublic: boolean;
  language: string | null;
  tags: string[];
  status: SessionStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Speaker {
  id: string;
  sessionId: string;
  name: string;
  title: string | null;
  company: string | null;
  bio: string | null;
  photo: string | null;
  email: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionWithDetails extends Session {
  speakers: Speaker[];
  venueRoom?: {
    id: string;
    name: string;
    capacity: number;
  };
  stats: {
    registeredCount: number;
    checkedInCount: number;
    averageRating: number | null;
    feedbackCount: number;
  };
}
