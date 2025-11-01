import AgendaClient from './AgendaClient';
import {
  demoEvents,
  demoSessions,
  congressSessions,
  techConnectSessions,
  demoVenueRooms,
  congressRooms,
  demoTracks,
  congressTracks,
  techConnectTracks,
} from '@/lib/demo-data';

export function generateStaticParams() {
  return [
    { id: 'event-1' },
    { id: 'event-2' },
    { id: 'event-3' },
    { id: 'event-congress-2024' },
    { id: 'event-techconnect-2024' },
  ];
}

export default function AgendaPage({ params }: { params: { id: string } }) {
  // Load static data based on event ID at build time
  const event = demoEvents.find((e) => e.id === params.id);

  // Get sessions for this event
  const allSessions = [...demoSessions, ...congressSessions, ...techConnectSessions];
  const sessions = allSessions.filter((s) => s.eventId === params.id);

  // Get rooms used by these sessions
  const allRooms = [...demoVenueRooms, ...congressRooms];
  const rooms = allRooms.filter((r) =>
    sessions.some((s) => s.venueRoomId === r.id)
  );

  // Get tracks used by these sessions
  const allTracks = [...demoTracks, ...congressTracks, ...techConnectTracks];
  const tracks = allTracks.filter((t) =>
    sessions.some((s) => s.trackId === t.id)
  );

  return (
    <AgendaClient
      initialEvent={event}
      initialSessions={sessions}
      initialRooms={rooms}
      initialTracks={tracks}
    />
  );
}
