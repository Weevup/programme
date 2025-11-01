'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin, Users, Filter, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Session, VenueRoom, Track } from '@/types/agenda';

interface ListViewProps {
  sessions: Session[];
  rooms: VenueRoom[];
  tracks?: Track[];
  selectedDate: Date;
  onSessionClick?: (session: Session) => void;
}

export default function ListView({
  sessions,
  rooms,
  tracks = [],
  selectedDate,
  onSessionClick,
}: ListViewProps) {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter sessions for selected date
  const daySessions = useMemo(() => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      const dateMatch =
        sessionDate.getDate() === selectedDate.getDate() &&
        sessionDate.getMonth() === selectedDate.getMonth() &&
        sessionDate.getFullYear() === selectedDate.getFullYear();

      // Filter by track
      const trackMatch =
        selectedTracks.length === 0 ||
        (session.trackId && selectedTracks.includes(session.trackId));

      // Filter by type
      const typeMatch = selectedType === 'all' || session.type === selectedType;

      return dateMatch && trackMatch && typeMatch;
    });
  }, [sessions, selectedDate, selectedTracks, selectedType]);

  // Sort sessions by start time
  const sortedSessions = useMemo(() => {
    return [...daySessions].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [daySessions]);

  const getTrack = (trackId?: string) => {
    return tracks.find((t) => t.id === trackId);
  };

  const getRoom = (roomId?: string) => {
    return rooms.find((r) => r.id === roomId);
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const getSessionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PLENARY: 'Plénière',
      WORKSHOP: 'Atelier',
      BREAK: 'Pause',
      MEAL: 'Repas',
      NETWORKING: 'Networking',
      OTHER: 'Autre',
    };
    return labels[type] || type;
  };

  const getSessionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PLENARY: 'bg-blue-100 text-blue-800',
      WORKSHOP: 'bg-green-100 text-green-800',
      BREAK: 'bg-gray-100 text-gray-800',
      MEAL: 'bg-orange-100 text-orange-800',
      NETWORKING: 'bg-purple-100 text-purple-800',
      OTHER: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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

  const sessionTypes = useMemo(() => {
    const types = new Set(sessions.map((s) => s.type));
    return Array.from(types);
  }, [sessions]);

  if (sortedSessions.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <Calendar className="mx-auto h-12 w-12 mb-4" />
          <p className="font-semibold mb-2">Aucune session programmée</p>
          <p className="text-sm">
            Aucune session ne correspond aux filtres sélectionnés pour cette journée
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Track Filter */}
          {tracks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Filter className="h-4 w-4" />
                <span>Parcours:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={selectedTracks.length === 0 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTracks([])}
                >
                  Tous
                </Button>
                {tracks
                  .sort((a, b) => a.ordre - b.ordre)
                  .map((track) => (
                    <Button
                      key={track.id}
                      variant={selectedTracks.includes(track.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTrack(track.id)}
                      className="gap-2"
                      style={{
                        backgroundColor: selectedTracks.includes(track.id)
                          ? track.couleur
                          : undefined,
                        borderColor: track.couleur,
                        color: selectedTracks.includes(track.id) ? 'white' : track.couleur,
                      }}
                    >
                      {track.icon && <span>{track.icon}</span>}
                      <span>{track.nom}</span>
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Type Filter */}
          {sessionTypes.length > 1 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Filter className="h-4 w-4" />
                <span>Type:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('all')}
                >
                  Tous
                </Button>
                {sessionTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {getSessionTypeLabel(type)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Sessions List */}
      <div className="space-y-3">
        {sortedSessions.map((session) => {
          const track = getTrack(session.trackId);
          const room = getRoom(session.venueRoomId);

          return (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSessionClick?.(session)}
              style={{
                borderLeft: track ? `4px solid ${track.couleur}` : undefined,
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
                    {session.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>
                  <Badge className={getSessionTypeColor(session.type)}>
                    {getSessionTypeLabel(session.type)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {/* Time */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">
                        {format(new Date(session.startTime), 'HH:mm', { locale: fr })} -{' '}
                        {format(new Date(session.endTime), 'HH:mm', { locale: fr })}
                      </div>
                      <div className="text-xs">{getSessionDuration(session)}</div>
                    </div>
                  </div>

                  {/* Room */}
                  {room && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">{room.name}</div>
                        {room.venue && (
                          <div className="text-xs">{room.venue.name}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Capacity */}
                  {session.maxCapacity && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">
                          {session.currentRegistrations || 0} / {session.maxCapacity}
                        </div>
                        <div className="text-xs">participants</div>
                      </div>
                    </div>
                  )}

                  {/* Track */}
                  {track && (
                    <div className="flex items-center gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          backgroundColor: `${track.couleur}20`,
                          color: track.couleur,
                        }}
                      >
                        {track.icon && <span>{track.icon}</span>}
                        <span>{track.nom}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Speakers */}
                {session.speakers && session.speakers.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-3 flex-wrap">
                      {session.speakers.map((speaker, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {speaker.photo && (
                            <img
                              src={speaker.photo}
                              alt={speaker.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div className="text-sm">
                            <div className="font-medium">{speaker.name}</div>
                            {speaker.title && speaker.company && (
                              <div className="text-xs text-muted-foreground">
                                {speaker.title} • {speaker.company}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="p-4 bg-muted/50">
        <div className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">{sortedSessions.length}</strong> session(s) affichée(s)
        </div>
      </Card>
    </div>
  );
}
