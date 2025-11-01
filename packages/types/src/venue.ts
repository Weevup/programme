import { z } from 'zod';

export enum VenueType {
  CONFERENCE_CENTER = 'CONFERENCE_CENTER',
  HOTEL = 'HOTEL',
  OUTDOOR = 'OUTDOOR',
  RESTAURANT = 'RESTAURANT',
  MUSEUM = 'MUSEUM',
  THEATER = 'THEATER',
  OTHER = 'OTHER',
}

export enum VenueStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

// Create Venue
export const createVenueSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  type: z.nativeEnum(VenueType),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  totalCapacity: z.number().int().positive().optional(),
  priceRange: z.string().optional(),
  rseScore: z.number().int().min(0).max(100).optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  website: z.string().url().optional(),
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>;

// Update Venue
export const updateVenueSchema = createVenueSchema.partial().extend({
  status: z.nativeEnum(VenueStatus).optional(),
  notes: z.string().optional(),
});

export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;

// Venue Room
export const createVenueRoomSchema = z.object({
  name: z.string().min(2),
  capacity: z.number().int().positive(),
  area: z.number().positive().optional(),
  setupTheater: z.number().int().positive().optional(),
  setupClassroom: z.number().int().positive().optional(),
  setupBanquet: z.number().int().positive().optional(),
  setupCocktail: z.number().int().positive().optional(),
  hasProjector: z.boolean().default(false),
  hasSound: z.boolean().default(false),
  hasWifi: z.boolean().default(true),
  hasAirCon: z.boolean().default(false),
  isAccessible: z.boolean().default(false),
  floor: z.number().int().optional(),
});

export type CreateVenueRoomInput = z.infer<typeof createVenueRoomSchema>;

// Venue Search Filters
export const venueSearchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  type: z.nativeEnum(VenueType).optional(),
  minCapacity: z.number().int().positive().optional(),
  maxCapacity: z.number().int().positive().optional(),
  minRseScore: z.number().int().min(0).max(100).optional(),
  status: z.nativeEnum(VenueStatus).optional(),
});

export type VenueSearchFilters = z.infer<typeof venueSearchSchema>;

// Response types
export interface Venue {
  id: string;
  name: string;
  description: string | null;
  type: VenueType;
  address: string;
  city: string;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  totalCapacity: number | null;
  priceRange: string | null;
  rseScore: number | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  status: VenueStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VenueRoom {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  area: number | null;
  setupTheater: number | null;
  setupClassroom: number | null;
  setupBanquet: number | null;
  setupCocktail: number | null;
  hasProjector: boolean;
  hasSound: boolean;
  hasWifi: boolean;
  hasAirCon: boolean;
  isAccessible: boolean;
  floor: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VenueWithRooms extends Venue {
  rooms: VenueRoom[];
}
