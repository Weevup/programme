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

export type ProgrammeEtat =
  | 'draft'
  | 'a_valider'
  | 'publie_interne'
  | 'publie_client'
  | 'verrouille'
  | 'archive';

export type InteractionType = 'qa' | 'quiz' | 'sondage' | 'wordcloud';

// ============================================
// PROGRAMME (Root)
// ============================================

export interface Programme {
  id: string;
  evenementId: string;
  titre: string;
  description?: string;

  // Dates
  dateDebut: Date | string;
  dateFin: Date | string;

  // État et versioning
  etat: ProgrammeEtat;
  version: string;
  versionPrecedenteId?: string;

  // Langues
  languesSupportees: string[]; // ['fr', 'en', 'es']
  langueParDefaut: string;

  // Tags & catégorisation
  tags: string[];

  // Publications
  publications: {
    portail_web: boolean;
    portail_mobile: boolean;
    integration_calendrier: boolean;
    export_pdf: boolean;
  };

  // Métadonnées
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string;
  lastModifiedBy?: string;
}

// ============================================
// JOURNÉE (Day Structure)
// ============================================

export interface Journee {
  id: string;
  programmeId: string;
  date: Date | string;
  titre: string;
  description?: string;
  ordre: number;

  // Horaires d'ouverture
  heuresOuverture: string; // "08:00"
  heuresFermeture: string; // "19:00"

  // Configuration
  estActif: boolean;
  couleurTheme?: string; // HEX color

  // Métadonnées
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================
// TRACK (Parcours thématique)
// ============================================

export interface Track {
  id: string;
  programmeId: string;
  nom: string;
  description?: string;
  couleur: string; // HEX color (e.g., "#3B82F6")
  ordre: number;

  // Segments & visibilité
  segmentsVisibles?: string[]; // IDs of segments who can see this track

  // Icon (optional)
  icon?: string;

  // Métadonnées
  estActif: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================
// SEGMENT / AUDIENCE
// ============================================

export interface Segment {
  id: string;
  evenementId: string;
  nom: string;
  description?: string;
  couleur?: string;

  // Type de segment
  type: 'role' | 'zone_geo' | 'langue' | 'custom';

  // Métadonnées
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

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
  programmeId?: string;
  journeeId?: string; // Reference to Journee
  trackId?: string; // Reference to Track

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
  currentRegistrations?: number;

  // Speakers
  speakers: Speaker[];

  // Visibility & access
  isPublic: boolean;
  segments?: string[]; // Deprecated in favor of segmentsAutorises
  segmentsAutorises?: string[]; // Segment IDs who can access
  segmentsExclus?: string[]; // Segment IDs who are excluded

  // Content
  language?: string;
  tags: string[];

  // Status
  status?: SessionStatus;

  // Logistique
  logistique?: {
    ressources?: string[]; // ["20 chaises", "1 micro", "2 écrans"]
    tempsMontage?: number; // minutes before session for setup
    tempsDemonte?: number; // minutes after session for teardown
    instructions?: string;
  };

  // Interactions (features enabled for this session)
  interactions?: {
    qaActive?: boolean;
    quizActive?: boolean;
    sondageActive?: boolean;
    wordcloudActive?: boolean;
  };

  // Prérequis & règles
  prerequis?: string[]; // Session IDs that must be attended first
  accesPremium?: boolean; // VIP only
  inscriptionRequise?: boolean; // Registration required

  // Stats
  _count?: {
    checkIns?: number;
    feedbacks?: number;
    interactions?: number;
    questions?: number; // Q&A questions
  };

  // Extended for UI
  track?: Track;
  journee?: Journee;

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
  type: 'room' | 'speaker' | 'time' | 'capacity' | 'setup' | 'curfew' | 'custom';
  severity: 'error' | 'warning' | 'info';
  message: string;
  sessions: string[]; // Session IDs
  autoResolvable?: boolean;
  suggestions?: string[];
}

export interface SessionConflict {
  sessionId: string;
  conflicts: ConflictType[];
}

// ============================================
// CONTRAINTES (Configurable rules)
// ============================================

export interface Contrainte {
  id: string;
  programmeId: string;
  nom: string;
  description?: string;
  type: 'temps_pause' | 'capacite_max' | 'heure_limite' | 'montage_demontage' | 'custom';

  // Règle
  regle: {
    condition: string; // e.g., "IF session.type === 'WORKSHOP'"
    validation: string; // e.g., "THEN session.duration >= 60"
    message: string; // Error message if violated
  };

  severite: 'error' | 'warning' | 'info';
  estActif: boolean;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================
// VERSIONING & PUBLICATION
// ============================================

export interface ProgrammeVersion {
  id: string;
  programmeId: string;
  version: string; // "1.0.0", "1.1.0", etc.

  // Snapshot of data at this version
  snapshot: {
    sessions: Session[];
    tracks: Track[];
    journees: Journee[];
  };

  // Changes from previous version
  changelog?: string;

  // État
  etat: ProgrammeEtat;
  datePublication?: Date | string;

  // Metadata
  createdBy: string;
  createdAt: Date | string;
}

export interface Publication {
  id: string;
  programmeId: string;
  versionId: string;

  // Publication channels
  canaux: {
    portail_web: boolean;
    portail_mobile: boolean;
    integration_calendrier: boolean;
    export_pdf: boolean;
  };

  // Segments
  segmentsCibles?: string[]; // null = tous les segments

  // Dates
  dateDebutPublication?: Date | string;
  dateFinPublication?: Date | string;

  // Notification
  notifierParticipants?: boolean;
  messageNotification?: string;

  // Status
  statut: 'scheduled' | 'active' | 'expired';

  createdAt: Date | string;
  updatedAt?: Date | string;
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
