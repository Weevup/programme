import type { Session, SessionConflict, ConflictType } from '@/types/agenda';

/**
 * Detect conflicts between sessions
 * Returns an array of conflicts for each session
 */
export function detectSessionConflicts(sessions: Session[]): SessionConflict[] {
  const conflicts: SessionConflict[] = [];

  sessions.forEach((session, index) => {
    const sessionConflicts: ConflictType[] = [];

    // Check against all other sessions
    sessions.forEach((other, otherIndex) => {
      if (index === otherIndex) return;

      const sessionStart = new Date(session.startTime);
      const sessionEnd = new Date(session.endTime);
      const otherStart = new Date(other.startTime);
      const otherEnd = new Date(other.endTime);

      // Check time overlap
      const hasTimeOverlap = sessionStart < otherEnd && sessionEnd > otherStart;

      if (!hasTimeOverlap) return;

      // Room conflict: Same room, overlapping time
      if (session.venueRoomId && session.venueRoomId === other.venueRoomId) {
        sessionConflicts.push({
          type: 'room',
          severity: 'error',
          message: `Conflit de salle avec "${other.title}"`,
          sessions: [session.id, other.id],
        });
      }

      // Speaker conflict: Same speaker, overlapping time
      if (session.speakers && other.speakers) {
        const sharedSpeakers = session.speakers.filter((s) =>
          other.speakers?.some((os) => os.name === s.name)
        );

        if (sharedSpeakers.length > 0) {
          sessionConflicts.push({
            type: 'speaker',
            severity: 'error',
            message: `Intervenant(s) ${sharedSpeakers.map((s) => s.name).join(', ')} en conflit avec "${other.title}"`,
            sessions: [session.id, other.id],
          });
        }
      }

      // Time warning: Sessions too close (less than 15 min apart)
      const timeBetween = Math.abs(
        Math.min(
          sessionStart.getTime() - otherEnd.getTime(),
          otherStart.getTime() - sessionEnd.getTime()
        )
      );

      if (
        !hasTimeOverlap &&
        timeBetween < 15 * 60 * 1000 &&
        timeBetween > 0 &&
        session.venueRoomId === other.venueRoomId
      ) {
        sessionConflicts.push({
          type: 'time',
          severity: 'warning',
          message: `Moins de 15 minutes avec "${other.title}"`,
          sessions: [session.id, other.id],
        });
      }
    });

    if (sessionConflicts.length > 0) {
      conflicts.push({
        sessionId: session.id,
        conflicts: sessionConflicts,
      });
    }
  });

  return conflicts;
}

/**
 * Get conflicts for a specific session
 */
export function getSessionConflicts(
  session: Session,
  allSessions: Session[]
): ConflictType[] {
  const conflicts = detectSessionConflicts([...allSessions, session]);
  return conflicts.find((c) => c.sessionId === session.id)?.conflicts || [];
}

/**
 * Check if a session has any conflicts
 */
export function hasConflicts(session: Session, allSessions: Session[]): boolean {
  const conflicts = getSessionConflicts(session, allSessions);
  return conflicts.some((c) => c.severity === 'error');
}

/**
 * Get conflict summary statistics
 */
export function getConflictStats(sessions: Session[]) {
  const allConflicts = detectSessionConflicts(sessions);

  const errorCount = allConflicts.reduce(
    (acc, sc) => acc + sc.conflicts.filter((c) => c.severity === 'error').length,
    0
  );

  const warningCount = allConflicts.reduce(
    (acc, sc) => acc + sc.conflicts.filter((c) => c.severity === 'warning').length,
    0
  );

  const roomConflicts = allConflicts.reduce(
    (acc, sc) => acc + sc.conflicts.filter((c) => c.type === 'room').length,
    0
  );

  const speakerConflicts = allConflicts.reduce(
    (acc, sc) => acc + sc.conflicts.filter((c) => c.type === 'speaker').length,
    0
  );

  return {
    total: allConflicts.length,
    errors: errorCount,
    warnings: warningCount,
    byType: {
      room: roomConflicts,
      speaker: speakerConflicts,
      time: warningCount,
    },
  };
}
