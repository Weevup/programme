import { z } from 'zod';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Create Event
export const createEventSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  languages: z.array(z.string()).default(['fr']),
  timezone: z.string().default('Europe/Paris'),
  budgetTotal: z.number().positive().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Update Event
export const updateEventSchema = createEventSchema.partial().extend({
  status: z.nativeEnum(EventStatus).optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// Event Response
export interface Event {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  languages: string[];
  timezone: string;
  budgetTotal: number | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event with stats
export interface EventWithStats extends Event {
  stats: {
    totalParticipants: number;
    totalSessions: number;
    totalCheckIns: number;
    totalVenues: number;
  };
}

// Event filters
export const eventFiltersSchema = z.object({
  status: z.nativeEnum(EventStatus).optional(),
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  search: z.string().optional(),
});

export type EventFilters = z.infer<typeof eventFiltersSchema>;
