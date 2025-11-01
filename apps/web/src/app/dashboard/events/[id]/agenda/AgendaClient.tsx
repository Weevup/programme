'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, Plus, Download, Upload, Filter, Grid, List, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import TimelineView from '@/components/agenda/TimelineView';
import ListView from '@/components/agenda/ListView';
import GridView from '@/components/agenda/GridView';
import SessionFormDialog from '@/components/agenda/SessionFormDialog';
import ConflictsPanel from '@/components/agenda/ConflictsPanel';
import SessionDetailModal from '@/components/agenda/SessionDetailModal';
import { detectSessionConflicts } from '@/lib/conflict-detector';
import { exportToMarkdown, exportToCSV, exportToJSON, downloadFile } from '@/lib/program-export';
import { enrichSessionWithData } from '@/lib/demo-data';
import type { Session, Track } from '@/types/agenda';

interface AgendaClientProps {
  initialEvent?: any;
  initialSessions?: Session[];
  initialRooms?: any[];
  initialTracks?: Track[];
}

export default function AgendaClient({
  initialEvent,
  initialSessions = [],
  initialRooms = [],
  initialTracks = [],
}: AgendaClientProps) {
  const params = useParams();
  const { toast } = useToast();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(initialEvent || null);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [rooms, setRooms] = useState<any[]>(initialRooms);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [isLoading, setIsLoading] = useState(!initialEvent);
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'grid' | 'conflicts'>('timeline');
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialEvent?.startDate ? new Date(initialEvent.startDate) : new Date()
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailSession, setDetailSession] = useState<Session | null>(null);

  useEffect(() => {
    // Only load from API if we don't have initial data
    if (!initialEvent) {
      loadEventData();
    }
  }, [eventId, initialEvent]);

  const loadEventData = async () => {
    setIsLoading(true);
    try {
      const eventRes = await api.get(`/events/${eventId}`);
      const eventData = eventRes.data;
      setEvent(eventData);

      // Set selected date to event start date
      if (eventData?.startDate) {
        setSelectedDate(new Date(eventData.startDate));
      }

      const sessionsRes = await api.get(`/events/${eventId}/sessions`);
      const loadedSessions = sessionsRes.data.data || [];
      setSessions(loadedSessions);

      const roomsRes = await api.get('/rooms');
      const allRooms = roomsRes.data.data || [];

      // Filter rooms to only show those that have sessions in this event
      const roomsWithSessions = allRooms.filter((room: any) =>
        loadedSessions.some((session: Session) => session.venueRoomId === room.id)
      );
      setRooms(roomsWithSessions);

      // Load tracks
      const tracksRes = await api.get('/tracks');
      const allTracks = tracksRes.data.data || [];

      // Filter tracks to only show those that have sessions in this event
      const tracksWithSessions = allTracks.filter((track: Track) =>
        loadedSessions.some((session: Session) => session.trackId === track.id)
      );
      setTracks(tracksWithSessions);
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

  const handleSaveSession = async (sessionData: Partial<Session>) => {
    try {
      if (selectedSession) {
        // Update existing session
        await api.patch(`/sessions/${selectedSession.id}`, sessionData);
        setSessions((prev) =>
          prev.map((s) => (s.id === selectedSession.id ? { ...s, ...sessionData } : s))
        );
        toast({
          title: 'Session mise à jour',
          description: 'La session a été mise à jour avec succès',
        });
      } else {
        // Create new session
        const response = await api.post(`/events/${eventId}/sessions`, sessionData);
        setSessions((prev) => [...prev, response.data]);
        toast({
          title: 'Session créée',
          description: 'La nouvelle session a été créée avec succès',
        });
      }
      setSelectedSession(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder la session',
      });
      throw error;
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  const handleSessionDetails = (session: Session) => {
    // Enrich session with documents, questions, feedbacks
    const enrichedSession = enrichSessionWithData(session);
    setDetailSession(enrichedSession);
    setIsDetailModalOpen(true);
  };

  const handleNewSession = () => {
    setSelectedSession(null);
    setIsDialogOpen(true);
  };

  const handleAddToAgenda = (sessionId: string) => {
    // TODO: Add to personal agenda - API call
    console.log('Add to agenda:', sessionId);
    toast({
      title: 'Ajouté à mon agenda',
      description: 'La session a été ajoutée à votre agenda personnel',
    });
  };

  const handleRemoveFromAgenda = (sessionId: string) => {
    // TODO: Remove from personal agenda - API call
    console.log('Remove from agenda:', sessionId);
    toast({
      title: 'Retiré de mon agenda',
      description: 'La session a été retirée de votre agenda personnel',
    });
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

  const handleExport = (format: 'markdown' | 'csv' | 'json') => {
    const eventName = event?.name || 'Programme';
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = exportToMarkdown(sessions, eventName);
        filename = `${eventName.replace(/\s+/g, '_')}_programme.md`;
        mimeType = 'text/markdown';
        break;
      case 'csv':
        content = exportToCSV(sessions);
        filename = `${eventName.replace(/\s+/g, '_')}_programme.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        content = exportToJSON(sessions, eventName);
        filename = `${eventName.replace(/\s+/g, '_')}_programme.json`;
        mimeType = 'application/json';
        break;
    }

    downloadFile(content, filename, mimeType);
    toast({
      title: 'Export réussi',
      description: `Le programme a été exporté au format ${format.toUpperCase()}`,
    });
  };

  const conflicts = detectSessionConflicts(sessions);

  const sessionsByDay = sessions.reduce((acc, session) => {
    const day = new Date(session.startTime).toLocaleDateString('fr-FR');
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

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
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button size="sm" onClick={handleNewSession}>
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

      {/* View Modes */}
      <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="space-y-4">
        <div className="flex items-center justify-between">
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
            <TabsTrigger value="conflicts">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Conflits
              {conflicts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {conflicts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>

        {/* Timeline View with Date Selector */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="flex items-center justify-between bg-white border rounded-lg p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <div className="font-semibold">{formatDate(selectedDate)}</div>
              <div className="text-sm text-muted-foreground">
                {sessions.filter(s => {
                  const d = new Date(s.startTime);
                  return d.toDateString() === selectedDate.toDateString();
                }).length} sessions
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <TimelineView
            sessions={sessions}
            rooms={rooms}
            tracks={tracks}
            selectedDate={selectedDate}
            onSessionClick={handleSessionDetails}
          />
        </TabsContent>

        {/* List View with Date Selector */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center justify-between bg-white border rounded-lg p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <div className="font-semibold">{formatDate(selectedDate)}</div>
              <div className="text-sm text-muted-foreground">
                {sessions.filter(s => {
                  const d = new Date(s.startTime);
                  return d.toDateString() === selectedDate.toDateString();
                }).length} sessions
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <ListView
            sessions={sessions}
            rooms={rooms}
            tracks={tracks}
            selectedDate={selectedDate}
            onSessionClick={handleSessionDetails}
          />
        </TabsContent>

        {/* Grid View with Date Selector */}
        <TabsContent value="grid" className="space-y-4">
          <div className="flex items-center justify-between bg-white border rounded-lg p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <div className="font-semibold">{formatDate(selectedDate)}</div>
              <div className="text-sm text-muted-foreground">
                {sessions.filter(s => {
                  const d = new Date(s.startTime);
                  return d.toDateString() === selectedDate.toDateString();
                }).length} sessions
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <GridView
            sessions={sessions}
            rooms={rooms}
            tracks={tracks}
            selectedDate={selectedDate}
            onSessionClick={handleSessionDetails}
          />
        </TabsContent>

        {/* Conflicts View */}
        <TabsContent value="conflicts">
          <ConflictsPanel
            conflicts={conflicts}
            sessions={sessions}
            onResolve={(sessionId) => {
              const session = sessions.find((s) => s.id === sessionId);
              if (session) {
                handleSessionClick(session);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Session Form Dialog */}
      <SessionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        session={selectedSession}
        eventId={eventId}
        rooms={rooms}
        allSessions={sessions}
        onSave={handleSaveSession}
      />

      {/* Session Detail Modal */}
      {detailSession && (
        <SessionDetailModal
          session={detailSession}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onAddToAgenda={handleAddToAgenda}
          onRemoveFromAgenda={handleRemoveFromAgenda}
        />
      )}
    </div>
  );
}
