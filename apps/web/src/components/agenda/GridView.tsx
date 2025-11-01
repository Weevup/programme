'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin, Users, Filter, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Session, VenueRoom, Track } from '@/types/agenda';

interface GridViewProps {
  sessions: Session[];
  rooms: VenueRoom[];
  tracks?: Track[];
  selectedDate: Date;
  onSessionClick?: (session: Session) => void;
}

export default function GridView({
  sessions,
  rooms,
  tracks = [],
  selectedDate,
  onSessionClick,
}: GridViewProps) {
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

  if (daySessions.length === 0) {
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

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daySessions.map((session) => {
          const track = getTrack(session.trackId);
          const room = getRoom(session.venueRoomId);

          return (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 flex flex-col"
              onClick={() => onSessionClick?.(session)}
              style={{
                borderTop: track ? `3px solid ${track.couleur}` : undefined,
              }}
            >
              <CardHeader className="pb-3 flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  {track && (
                    <div
                      className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: `${track.couleur}20`,
                        color: track.couleur,
                      }}
                    >
                      {track.icon && <span>{track.icon}</span>}
                      <span className="truncate">{track.nom}</span>
                    </div>
                  )}
                  <Badge className={`${getSessionTypeColor(session.type)} flex-shrink-0`}>
                    {getSessionTypeLabel(session.type)}
                  </Badge>
                </div>

                <CardTitle className="text-base leading-snug line-clamp-2">
                  {session.title}
                </CardTitle>

                {session.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {session.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {format(new Date(session.startTime), 'HH:mm', { locale: fr })} -{' '}
                      {format(new Date(session.endTime), 'HH:mm', { locale: fr })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getSessionDuration(session)}
                    </div>
                  </div>
                </div>

                {/* Room */}
                {room && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{room.name}</div>
                      {room.venue && (
                        <div className="text-xs text-muted-foreground truncate">
                          {room.venue.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {session.maxCapacity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <span className="font-medium">
                        {session.currentRegistrations || 0}
                      </span>
                      <span className="text-muted-foreground"> / {session.maxCapacity}</span>
                    </div>
                  </div>
                )}

                {/* Speakers */}
                {session.speakers && session.speakers.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {session.speakers.slice(0, 3).map((speaker, idx) => (
                          <img
                            key={idx}
                            src={speaker.photo}
                            alt={speaker.name}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                            title={speaker.name}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.speakers.length} intervenant(s)
                      </div>
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
          <strong className="text-foreground">{daySessions.length}</strong> session(s) affichée(s)
        </div>
      </Card>
    </div>
  );
}
