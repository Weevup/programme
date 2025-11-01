'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Session, VenueRoom } from '@/types/agenda';

interface TimelineViewProps {
  sessions: Session[];
  rooms: VenueRoom[];
  selectedDate: Date;
  onSessionClick?: (session: Session) => void;
}

export default function TimelineView({
  sessions,
  rooms,
  selectedDate,
  onSessionClick,
}: TimelineViewProps) {
  // Filter sessions for selected date
  const daySessions = useMemo(() => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return (
        sessionDate.getDate() === selectedDate.getDate() &&
        sessionDate.getMonth() === selectedDate.getMonth() &&
        sessionDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [sessions, selectedDate]);

  // Get time range for the day
  const timeRange = useMemo(() => {
    if (daySessions.length === 0) {
      return { start: 8, end: 20 }; // Default 8h-20h
    }

    const times = daySessions.flatMap((s) => [
      new Date(s.startTime).getHours(),
      new Date(s.endTime).getHours() + 1,
    ]);

    return {
      start: Math.max(Math.floor(Math.min(...times) - 0.5), 0),
      end: Math.min(Math.ceil(Math.max(...times) + 0.5), 24),
    };
  }, [daySessions]);

  // Generate time slots (every 30 minutes)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = timeRange.start; hour < timeRange.end; hour++) {
      slots.push({ hour, minute: 0 });
      slots.push({ hour, minute: 30 });
    }
    return slots;
  }, [timeRange]);

  const getSessionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PLENARY: 'bg-blue-500 border-blue-600 text-white',
      WORKSHOP: 'bg-green-500 border-green-600 text-white',
      BREAK: 'bg-gray-300 border-gray-400 text-gray-800',
      MEAL: 'bg-orange-400 border-orange-500 text-white',
      NETWORKING: 'bg-purple-500 border-purple-600 text-white',
      ENTERTAINMENT: 'bg-pink-500 border-pink-600 text-white',
      OTHER: 'bg-gray-400 border-gray-500 text-white',
    };
    return colors[type] || colors.OTHER;
  };

  const getSessionPosition = (session: Session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const rangeStartMinutes = timeRange.start * 60;
    const rangeEndMinutes = timeRange.end * 60;
    const totalMinutes = rangeEndMinutes - rangeStartMinutes;

    const top = ((startMinutes - rangeStartMinutes) / totalMinutes) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100;

    return { top: `${top}%`, height: `${height}%` };
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = (session: Session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const minutes = (end.getTime() - start.getTime()) / 1000 / 60;
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`;
  };

  // Group sessions by room
  const sessionsByRoom = useMemo(() => {
    const grouped: Record<string, Session[]> = {};

    // Initialize with all rooms
    rooms.forEach((room) => {
      grouped[room.id] = [];
    });

    // Add sessions without room to a special key
    grouped['no-room'] = [];

    // Group sessions
    daySessions.forEach((session) => {
      const roomId = session.venueRoomId || 'no-room';
      if (!grouped[roomId]) {
        grouped[roomId] = [];
      }
      grouped[roomId].push(session);
    });

    return grouped;
  }, [daySessions, rooms]);

  if (daySessions.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <Clock className="mx-auto h-12 w-12 mb-4" />
          <p>Aucune session programmée pour cette journée</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Header with room names */}
      <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(200px,1fr))] border-b bg-gray-50">
        <div className="p-3 border-r sticky left-0 bg-gray-50 z-10">
          <span className="text-sm font-semibold text-muted-foreground">Horaire</span>
        </div>
        {rooms.map((room) => (
          <div key={room.id} className="p-3 border-r last:border-r-0">
            <div className="font-semibold text-sm">{room.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span>
                {room.capacity} places {room.venue && `· ${room.venue.name}`}
              </span>
            </div>
          </div>
        ))}
        {sessionsByRoom['no-room'] && sessionsByRoom['no-room'].length > 0 && (
          <div className="p-3">
            <div className="font-semibold text-sm">Sans salle</div>
          </div>
        )}
      </div>

      {/* Timeline grid */}
      <div className="relative">
        <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(200px,1fr))]">
          {/* Time column */}
          <div className="border-r sticky left-0 bg-white z-10">
            {timeSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`h-12 px-3 flex items-center text-xs text-muted-foreground border-b ${
                  slot.minute === 0 ? 'border-t font-medium' : 'border-gray-200'
                }`}
              >
                {slot.minute === 0 && formatTime(slot.hour, slot.minute)}
              </div>
            ))}
          </div>

          {/* Room columns */}
          {rooms.map((room) => (
            <div key={room.id} className="relative border-r last:border-r-0">
              {/* Time slot grid lines */}
              {timeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`h-12 border-b ${
                    slot.minute === 0 ? 'border-t' : 'border-gray-200'
                  }`}
                />
              ))}

              {/* Sessions */}
              <div className="absolute inset-0 p-1">
                {sessionsByRoom[room.id]?.map((session) => {
                  const position = getSessionPosition(session);
                  return (
                    <div
                      key={session.id}
                      className={`absolute left-1 right-1 rounded-lg border-2 p-2 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${getSessionTypeColor(
                        session.type
                      )}`}
                      style={position}
                      onClick={() => onSessionClick?.(session)}
                    >
                      <div className="font-semibold text-sm line-clamp-2 mb-1">
                        {session.title}
                      </div>
                      <div className="text-xs opacity-90 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(session.startTime), 'HH:mm')} -{' '}
                        {format(new Date(session.endTime), 'HH:mm')}
                        <span className="ml-1">({getSessionDuration(session)})</span>
                      </div>
                      {session.speakers && session.speakers.length > 0 && (
                        <div className="text-xs opacity-90 truncate mt-1">
                          {session.speakers.map((s) => s.name).join(', ')}
                        </div>
                      )}
                      {session.maxCapacity && (
                        <div className="text-xs opacity-90 mt-1">
                          {session.maxCapacity} places
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* No room column */}
          {sessionsByRoom['no-room'] && sessionsByRoom['no-room'].length > 0 && (
            <div className="relative">
              {timeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`h-12 border-b ${
                    slot.minute === 0 ? 'border-t' : 'border-gray-200'
                  }`}
                />
              ))}

              <div className="absolute inset-0 p-1">
                {sessionsByRoom['no-room'].map((session) => {
                  const position = getSessionPosition(session);
                  return (
                    <div
                      key={session.id}
                      className={`absolute left-1 right-1 rounded-lg border-2 p-2 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${getSessionTypeColor(
                        session.type
                      )}`}
                      style={position}
                      onClick={() => onSessionClick?.(session)}
                    >
                      <div className="font-semibold text-sm line-clamp-2 mb-1">
                        {session.title}
                      </div>
                      <div className="text-xs opacity-90">
                        {format(new Date(session.startTime), 'HH:mm')} -{' '}
                        {format(new Date(session.endTime), 'HH:mm')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
