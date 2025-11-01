'use client';

import { useState, useEffect } from 'react';
import { Plus, X, AlertTriangle, Users as UsersIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Session, SessionType, VenueRoom, Speaker } from '@/types/agenda';

interface SessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  eventId: string;
  rooms: VenueRoom[];
  allSessions: Session[];
  onSave: (sessionData: Partial<Session>) => Promise<void>;
}

const SESSION_TYPES: { value: SessionType; label: string; color: string }[] = [
  { value: 'PLENARY', label: 'Plénière', color: 'bg-blue-100 text-blue-800' },
  { value: 'WORKSHOP', label: 'Atelier', color: 'bg-green-100 text-green-800' },
  { value: 'BREAK', label: 'Pause', color: 'bg-gray-100 text-gray-800' },
  { value: 'MEAL', label: 'Repas', color: 'bg-orange-100 text-orange-800' },
  { value: 'NETWORKING', label: 'Networking', color: 'bg-purple-100 text-purple-800' },
  { value: 'ENTERTAINMENT', label: 'Divertissement', color: 'bg-pink-100 text-pink-800' },
  { value: 'OTHER', label: 'Autre', color: 'bg-gray-100 text-gray-800' },
];

export default function SessionFormDialog({
  open,
  onOpenChange,
  session,
  eventId,
  rooms,
  allSessions,
  onSave,
}: SessionFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Session>>({
    title: '',
    description: '',
    type: 'WORKSHOP',
    startTime: '',
    endTime: '',
    venueRoomId: '',
    maxCapacity: undefined,
    isPublic: true,
    language: 'fr',
    tags: [],
    speakers: [],
  });

  const [newSpeaker, setNewSpeaker] = useState({
    name: '',
    title: '',
    company: '',
  });

  const [newTag, setNewTag] = useState('');
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        description: session.description || '',
        type: session.type,
        startTime: session.startTime,
        endTime: session.endTime,
        venueRoomId: session.venueRoomId || '',
        maxCapacity: session.maxCapacity,
        isPublic: session.isPublic,
        language: session.language || 'fr',
        tags: session.tags || [],
        speakers: session.speakers || [],
      });
    } else {
      // Reset form for new session
      setFormData({
        title: '',
        description: '',
        type: 'WORKSHOP',
        startTime: '',
        endTime: '',
        venueRoomId: '',
        maxCapacity: undefined,
        isPublic: true,
        language: 'fr',
        tags: [],
        speakers: [],
      });
    }
  }, [session, open]);

  // Detect conflicts
  useEffect(() => {
    if (!formData.startTime || !formData.endTime || !formData.venueRoomId) {
      setConflicts([]);
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    const conflictingSessions = allSessions.filter((s) => {
      if (session && s.id === session.id) return false; // Skip current session when editing
      if (s.venueRoomId !== formData.venueRoomId) return false; // Different room

      const sStart = new Date(s.startTime);
      const sEnd = new Date(s.endTime);

      // Check overlap
      return (start < sEnd && end > sStart);
    });

    setConflicts(conflictingSessions.map((s) => s.title));
  }, [formData.startTime, formData.endTime, formData.venueRoomId, allSessions, session]);

  const handleAddSpeaker = () => {
    if (!newSpeaker.name.trim()) return;

    setFormData((prev) => ({
      ...prev,
      speakers: [
        ...(prev.speakers || []),
        {
          id: `temp-${Date.now()}`,
          ...newSpeaker,
          order: (prev.speakers?.length || 0),
        } as Speaker,
      ],
    }));

    setNewSpeaker({ name: '', title: '', company: '' });
  };

  const handleRemoveSpeaker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers?.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags?.includes(newTag.trim())) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), newTag.trim()],
    }));

    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startTime || !formData.endTime) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        eventId,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Modifier la session' : 'Nouvelle session'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de la session
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Keynote d'ouverture"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez le contenu de la session..."
              rows={3}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type de session *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: SessionType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={type.color}>{type.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin *</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Room */}
          <div className="space-y-2">
            <Label htmlFor="room">Salle</Label>
            <Select
              value={formData.venueRoomId || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, venueRoomId: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une salle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune salle</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - {room.capacity} places
                    {room.venue && ` (${room.venue.name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conflicts Warning */}
          {conflicts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800">Conflit détecté</p>
                <p className="text-sm text-yellow-700">
                  Cette session chevauche : {conflicts.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Capacité maximale</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={formData.maxCapacity || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxCapacity: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="Ex: 100"
            />
          </div>

          {/* Speakers */}
          <div className="space-y-2">
            <Label>Intervenants</Label>
            <div className="space-y-2">
              {formData.speakers && formData.speakers.length > 0 && (
                <div className="space-y-2">
                  {formData.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                    >
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{speaker.name}</div>
                        {(speaker.title || speaker.company) && (
                          <div className="text-xs text-muted-foreground">
                            {speaker.title}
                            {speaker.title && speaker.company && ' · '}
                            {speaker.company}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSpeaker(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Nom *"
                  value={newSpeaker.name}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                />
                <Input
                  placeholder="Fonction"
                  value={newSpeaker.title}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, title: e.target.value })}
                />
                <Input
                  placeholder="Société"
                  value={newSpeaker.company}
                  onChange={(e) =>
                    setNewSpeaker({ ...newSpeaker, company: e.target.value })
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSpeaker}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un intervenant
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-2">
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || conflicts.length > 0}>
              {isSubmitting
                ? 'Enregistrement...'
                : session
                ? 'Mettre à jour'
                : 'Créer la session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
