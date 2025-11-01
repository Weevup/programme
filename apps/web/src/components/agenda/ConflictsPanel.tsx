'use client';

import { AlertTriangle, Users, MapPin, Clock, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SessionConflict, Session } from '@/types/agenda';

interface ConflictsPanelProps {
  conflicts: SessionConflict[];
  sessions: Session[];
  onResolve?: (sessionId: string) => void;
}

export default function ConflictsPanel({
  conflicts,
  sessions,
  onResolve,
}: ConflictsPanelProps) {
  if (conflicts.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 text-green-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Aucun conflit détecté</h3>
              <p className="text-sm text-green-700">Votre planning est parfaitement organisé</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const errorConflicts = conflicts.filter((c) =>
    c.conflicts.some((conf) => conf.severity === 'error')
  );
  const warningConflicts = conflicts.filter(
    (c) => !c.conflicts.some((conf) => conf.severity === 'error')
  );

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'room':
        return MapPin;
      case 'speaker':
        return Users;
      case 'time':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getConflictColor = (severity: string) => {
    return severity === 'error'
      ? 'border-red-200 bg-red-50'
      : 'border-yellow-200 bg-yellow-50';
  };

  const getSession = (sessionId: string) => {
    return sessions.find((s) => s.id === sessionId);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Conflits détectés
          </CardTitle>
          <CardDescription>
            {errorConflicts.length} erreur{errorConflicts.length > 1 ? 's' : ''} · {warningConflicts.length} avertissement
            {warningConflicts.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Error Conflicts */}
      {errorConflicts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Erreurs critiques ({errorConflicts.length})
          </h3>
          {errorConflicts.map((conflict) => {
            const session = getSession(conflict.sessionId);
            if (!session) return null;

            return (
              <Card key={conflict.sessionId} className={getConflictColor('error')}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">{session.title}</h4>
                      <p className="text-sm text-red-700 mt-1">
                        {new Date(session.startTime).toLocaleString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(session.endTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      <div className="mt-3 space-y-2">
                        {conflict.conflicts
                          .filter((c) => c.severity === 'error')
                          .map((conf, idx) => {
                            const Icon = getConflictIcon(conf.type);
                            return (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-sm text-red-800"
                              >
                                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>{conf.message}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {onResolve && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResolve(conflict.sessionId)}
                        className="flex-shrink-0"
                      >
                        Résoudre
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Warning Conflicts */}
      {warningConflicts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Avertissements ({warningConflicts.length})
          </h3>
          {warningConflicts.map((conflict) => {
            const session = getSession(conflict.sessionId);
            if (!session) return null;

            return (
              <Card key={conflict.sessionId} className={getConflictColor('warning')}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900">{session.title}</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {new Date(session.startTime).toLocaleString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      <div className="mt-3 space-y-2">
                        {conflict.conflicts.map((conf, idx) => {
                          const Icon = getConflictIcon(conf.type);
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm text-yellow-800"
                            >
                              <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{conf.message}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
