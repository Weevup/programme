'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, Plus, Download, Upload, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import type { Session } from '@/types/agenda';

export default function AgendaClient() {
  const params = useParams();
  const { toast } = useToast();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'grid'>('timeline');

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    setIsLoading(true);
    try {
      // Load event
      const eventRes = await api.get(`/events/${eventId}`);
      setEvent(eventRes.data);

      // Load sessions
      const sessionsRes = await api.get(`/events/${eventId}/sessions`);
      setSessions(sessionsRes.data.data || []);

      // Load all rooms
      const roomsRes = await api.get('/rooms');
      setRooms(roomsRes.data.data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les données',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PLENARY: 'bg-blue-100 text-blue-800',
      WORKSHOP: 'bg-green-100 text-green-800',
      BREAK: 'bg-gray-100 text-gray-800',
      MEAL: 'bg-orange-100 text-orange-800',
      NETWORKING: 'bg-purple-100 text-purple-800',
      ENTERTAINMENT: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.OTHER;
  };

  const getSessionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PLENARY: 'Plénière',
      WORKSHOP: 'Atelier',
      BREAK: 'Pause',
      MEAL: 'Repas',
      NETWORKING: 'Networking',
      ENTERTAINMENT: 'Divertissement',
      OTHER: 'Autre',
    };
    return labels[type] || type;
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group sessions by day
  const sessionsByDay = sessions.reduce((acc, session) => {
    const day = new Date(session.startTime).toLocaleDateString('fr-FR');
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  // Sort sessions by start time
  Object.keys(sessionsByDay).forEach((day) => {
    sessionsByDay[day].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  const stats = {
    total: sessions.length,
    plenary: sessions.filter((s) => s.type === 'PLENARY').length,
    workshops: sessions.filter((s) => s.type === 'WORKSHOP').length,
    breaks: sessions.filter((s) => s.type === 'BREAK').length,
    totalSpeakers: sessions.reduce((acc, s) => acc + (s.speakers?.length || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programme</h1>
          <p className="text-muted-foreground">{event?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle session
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plénières</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.plenary}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ateliers</CardTitle>
            <Grid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workshops}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pauses</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.breaks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSpeakers}</div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full">
          <TabsList>
            <TabsTrigger value="timeline">
              <Calendar className="mr-2 h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid className="mr-2 h-4 w-4" />
              Grille
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>

      {/* Sessions Display */}
      <div className="space-y-6">
        {Object.keys(sessionsByDay).map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle>{formatDate(sessionsByDay[day][0].startTime)}</CardTitle>
              <CardDescription>{sessionsByDay[day].length} sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionsByDay[day].map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    {/* Time */}
                    <div className="flex flex-col items-center min-w-[80px] pt-1">
                      <span className="text-sm font-semibold">
                        {formatTime(session.startTime)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(session.endTime)}
                      </span>
                    </div>

                    {/* Session Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{session.title}</h4>
                          {session.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {session.description}
                            </p>
                          )}
                        </div>
                        <Badge className={getSessionTypeColor(session.type)}>
                          {getSessionTypeLabel(session.type)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {session.venueRoom && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{session.venueRoom.name}</span>
                          </div>
                        )}

                        {session.speakers && session.speakers.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {session.speakers.map((s) => s.name).join(', ')}
                            </span>
                          </div>
                        )}

                        {session.maxCapacity && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{session.maxCapacity} places</span>
                          </div>
                        )}

                        {session._count && session._count.checkIns !== undefined && (
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary">
                              {session._count.checkIns} check-ins
                            </Badge>
                          </div>
                        )}
                      </div>

                      {session.tags && session.tags.length > 0 && (
                        <div className="flex gap-2">
                          {session.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {sessions.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Aucune session</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Commencez par créer votre première session
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
