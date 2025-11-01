// ============================================
// AGENDA / PROGRAMME TYPES
// ============================================

export type SessionType =
  | 'PLENARY'
  | 'WORKSHOP'
  | 'BREAK'
  | 'MEAL'
  | 'NETWORKING'
  | 'ENTERTAINMENT'
  | 'OTHER';

export type SessionStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Speaker {
  id: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  photo?: string;
  email?: string;
  order: number;
}

export interface VenueRoom {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  area?: number;

  // Setup configurations
  setupTheater?: number;
  setupClassroom?: number;
  setupBanquet?: number;
  setupCocktail?: number;

  // Equipment & features
  hasProjector: boolean;
  hasSound: boolean;
  hasWifi: boolean;
  hasAirCon: boolean;
  isAccessible: boolean;

  floor?: number;

  // Extended for UI
  venue?: {
    id: string;
    name: string;
    city: string;
  };
}

export interface Session {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  type: SessionType;

  // Timing
  startTime: Date | string;
  endTime: Date | string;

  // Location
  venueRoomId?: string;
  venueRoom?: VenueRoom;
  location?: string;

  // Capacity
  maxCapacity?: number;

  // Speakers
  speakers: Speaker[];

  // Visibility & access
  isPublic: boolean;
  segments?: string[];

  // Content
  language?: string;
  tags: string[];

  // Status
  status?: SessionStatus;

  // Stats
  _count?: {
    checkIns?: number;
    feedbacks?: number;
    interactions?: number;
  };

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================
// AGENDA VIEW TYPES
// ============================================

export interface TimeSlot {
  start: Date;
  end: Date;
  duration: number; // in minutes
}

export interface DaySchedule {
  date: Date;
  sessions: Session[];
  timeSlots: TimeSlot[];
}

export interface RoomSchedule {
  room: VenueRoom;
  sessions: Session[];
}

export interface AgendaView {
  type: 'day' | 'week' | 'room' | 'timeline';
  startDate: Date;
  endDate: Date;
  rooms: VenueRoom[];
  sessions: Session[];
}

// ============================================
// DRAG & DROP TYPES
// ============================================

export interface DraggedSession {
  session: Session;
  originalRoomId?: string;
  originalStartTime: Date;
}

export interface DropTarget {
  roomId?: string;
  startTime: Date;
  endTime: Date;
}

// ============================================
// CONFLICT DETECTION
// ============================================

export interface ConflictType {
  type: 'room' | 'speaker' | 'time';
  severity: 'error' | 'warning';
  message: string;
  sessions: string[]; // Session IDs
}

export interface SessionConflict {
  sessionId: string;
  conflicts: ConflictType[];
}

// ============================================
// TEMPLATES
// ============================================

export interface ProgramTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'conference' | 'seminar' | 'workshop' | 'hybrid' | 'custom';
  duration: number; // in days

  // Template sessions (without specific dates)
  templateSessions: TemplateSession[];

  tags: string[];
  isPublic: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TemplateSession {
  id: string;
  title: string;
  description?: string;
  type: SessionType;

  // Relative timing (day 1, day 2, etc.)
  dayOffset: number; // 0 = first day, 1 = second day, etc.
  startTimeOfDay: string; // "09:00"
  duration: number; // in minutes

  // Room requirements
  roomRequirements?: {
    capacity?: number;
    hasProjector?: boolean;
    hasSound?: boolean;
  };

  tags: string[];
}

// ============================================
// STATISTICS
// ============================================

export interface ProgramStats {
  totalSessions: number;
  sessionsByType: Record<SessionType, number>;
  sessionsByDay: Record<string, number>; // ISO date string -> count
  sessionsByRoom: Record<string, number>; // room ID -> count

  totalDuration: number; // in minutes
  averageSessionDuration: number;

  totalSpeakers: number;
  uniqueSpeakers: number;

  conflicts: SessionConflict[];
  utilizationRate: number; // % of available time slots used
}

// ============================================
// FORM TYPES
// ============================================

export interface SessionFormData {
  title: string;
  description?: string;
  type: SessionType;
  startTime: Date;
  endTime: Date;
  venueRoomId?: string;
  location?: string;
  maxCapacity?: number;
  isPublic: boolean;
  language?: string;
  tags: string[];
  speakers: Omit<Speaker, 'id' | 'order'>[];
}

export interface BulkSessionImport {
  file: File;
  format: 'csv' | 'excel' | 'json';
  mapping: Record<string, string>; // CSV column -> Session field
}

// ============================================
// FILTERS & SORTING
// ============================================

export interface SessionFilters {
  types?: SessionType[];
  rooms?: string[]; // room IDs
  speakers?: string[]; // speaker names
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  isPublic?: boolean;
}

export interface SessionSort {
  field: 'startTime' | 'title' | 'type' | 'room' | 'duration';
  direction: 'asc' | 'desc';
}
