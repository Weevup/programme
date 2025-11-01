import axios from 'axios';
import {
  demoUser,
  demoEvents,
  demoVenues,
  demoEventStats,
  demoParticipant,
} from './demo-data';

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Demo API mock
const demoAPI = {
  get: async (url: string, config?: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    // Auth endpoints
    if (url === '/auth/me') {
      return { data: demoUser };
    }

    // Events endpoints
    if (url === '/events') {
      return {
        data: {
          data: demoEvents,
          total: demoEvents.length,
          page: 1,
          pageSize: 20,
          totalPages: 1,
        },
      };
    }

    if (url.startsWith('/events/') && url.endsWith('/stats')) {
      const eventId = url.split('/')[2];
      return {
        data: {
          event: demoEvents.find((e) => e.id === eventId),
          stats: demoEventStats[eventId as keyof typeof demoEventStats] || demoEventStats['event-2'],
        },
      };
    }

    if (url.startsWith('/events/')) {
      const eventId = url.split('/')[2];
      const event = demoEvents.find((e) => e.id === eventId);
      if (event) {
        return { data: event };
      }
      throw new Error('Event not found');
    }

    // Venues endpoints
    if (url === '/venues') {
      return {
        data: {
          data: demoVenues,
          total: demoVenues.length,
          page: 1,
          pageSize: 20,
          totalPages: 1,
        },
      };
    }

    if (url.startsWith('/venues/')) {
      const venueId = url.split('/')[2];
      const venue = demoVenues.find((v) => v.id === venueId);
      if (venue) {
        return { data: venue };
      }
      throw new Error('Venue not found');
    }

    // Participants endpoints
    if (url.startsWith('/participants/qr/')) {
      return { data: demoParticipant };
    }

    return { data: null };
  },

  post: async (url: string, data?: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Auth endpoints
    if (url === '/auth/login') {
      return {
        data: {
          user: demoUser,
          accessToken: 'demo-token-12345',
        },
      };
    }

    if (url === '/auth/register') {
      return {
        data: {
          user: { ...demoUser, ...data },
          accessToken: 'demo-token-12345',
        },
      };
    }

    // Events
    if (url === '/events') {
      const newEvent = {
        ...data,
        id: `event-${Date.now()}`,
        createdById: demoUser.id,
        createdBy: demoUser,
        _count: {
          participants: 0,
          sessions: 0,
          venues: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      demoEvents.push(newEvent);
      return { data: newEvent };
    }

    // Venues
    if (url === '/venues') {
      const newVenue = {
        ...data,
        id: `venue-${Date.now()}`,
        rooms: [],
        _count: {
          events: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      demoVenues.push(newVenue);
      return { data: newVenue };
    }

    // Check-in
    if (url === '/participants/check-in') {
      return {
        data: {
          checkIn: {
            id: `checkin-${Date.now()}`,
            eventId: data.eventId,
            participantId: demoParticipant.id,
            checkInTime: new Date(),
            checkInType: 'EVENT',
          },
          participant: { ...demoParticipant, status: 'CHECKED_IN' },
        },
      };
    }

    return { data: null };
  },

  patch: async (url: string, data?: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: { ...data, updatedAt: new Date() } };
  },

  delete: async (url: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Remove from demo data
    if (url.startsWith('/events/')) {
      const eventId = url.split('/')[2];
      const index = demoEvents.findIndex((e) => e.id === eventId);
      if (index > -1) {
        demoEvents.splice(index, 1);
      }
    }

    return { data: { success: true } };
  },
};

// Real API client
export const api = isDemoMode
  ? demoAPI
  : axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

// Request interceptor for adding auth token (only for real API)
if (!isDemoMode && typeof api !== 'function') {
  (api as any).interceptors.request.use(
    (config: any) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling errors (only for real API)
  (api as any).interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}
