import { z } from 'zod';

export enum ParticipantRole {
  ATTENDEE = 'ATTENDEE',
  SPEAKER = 'SPEAKER',
  SPONSOR = 'SPONSOR',
  STAFF = 'STAFF',
  VIP = 'VIP',
  PRESS = 'PRESS',
}

export enum ParticipantStatus {
  INVITED = 'INVITED',
  REGISTERED = 'REGISTERED',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED',
}

// Create Participant
export const createParticipantSchema = z.object({
  eventId: z.string().cuid(),
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(ParticipantRole).default(ParticipantRole.ATTENDEE),
  language: z.string().default('fr'),
  dietaryReqs: z.string().optional(),
  needsTransport: z.boolean().default(false),
  needsAccommodation: z.boolean().default(false),
  consentMarketing: z.boolean().default(false),
  consentData: z.boolean().default(true),
  customFields: z.record(z.any()).optional(),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;

// Update Participant
export const updateParticipantSchema = createParticipantSchema.partial().extend({
  status: z.nativeEnum(ParticipantStatus).optional(),
});

export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;

// Import CSV
export const importParticipantsSchema = z.object({
  eventId: z.string().cuid(),
  csvData: z.string(),
  skipDuplicates: z.boolean().default(true),
});

export type ImportParticipantsInput = z.infer<typeof importParticipantsSchema>;

// Check-in
export const checkInSchema = z.object({
  eventId: z.string().cuid(),
  participantId: z.string().cuid().optional(),
  qrCode: z.string().optional(),
  sessionId: z.string().cuid().optional(),
  location: z.string().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

// Segment
export const createSegmentSchema = z.object({
  eventId: z.string().cuid(),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isSmartList: z.boolean().default(false),
  rules: z.record(z.any()).optional(),
});

export type CreateSegmentInput = z.infer<typeof createSegmentSchema>;

// Response types
export interface Participant {
  id: string;
  eventId: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  jobTitle: string | null;
  phone: string | null;
  role: ParticipantRole;
  registeredAt: Date;
  status: ParticipantStatus;
  qrCode: string;
  language: string;
  dietaryReqs: string | null;
  needsTransport: boolean;
  needsAccommodation: boolean;
  consentMarketing: boolean;
  consentData: boolean;
  consentDate: Date | null;
  customFields: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Segment {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  color: string | null;
  isSmartList: boolean;
  rules: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentWithCount extends Segment {
  participantCount: number;
}

export interface CheckIn {
  id: string;
  eventId: string;
  participantId: string;
  sessionId: string | null;
  checkInTime: Date;
  checkInType: string;
  location: string | null;
  scannerUserId: string | null;
}
