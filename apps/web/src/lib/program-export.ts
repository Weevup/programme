import type { Session, VenueRoom } from '@/types/agenda';

/**
 * Export program to Markdown format
 */
export function exportToMarkdown(sessions: Session[], eventName: string): string {
  const sessionsByDay = groupSessionsByDay(sessions);

  let markdown = `# ${eventName}\n\n`;
  markdown += `## Programme\n\n`;
  markdown += `Généré le ${new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}\n\n`;
  markdown += `**Total:** ${sessions.length} sessions\n\n`;
  markdown += `---\n\n`;

  Object.keys(sessionsByDay).forEach((day) => {
    const daySessions = sessionsByDay[day];
    markdown += `## ${formatDate(daySessions[0].startTime)}\n\n`;
    markdown += `${daySessions.length} sessions\n\n`;

    daySessions.forEach((session) => {
      const start = formatTime(session.startTime);
      const end = formatTime(session.endTime);
      const duration = getDuration(session.startTime, session.endTime);

      markdown += `### ${start} - ${end} (${duration}) - ${session.title}\n\n`;

      if (session.description) {
        markdown += `${session.description}\n\n`;
      }

      markdown += `**Type:** ${getTypeLabel(session.type)}\n\n`;

      if (session.venueRoom) {
        markdown += `**Salle:** ${session.venueRoom.name}`;
        if (session.maxCapacity) {
          markdown += ` (${session.maxCapacity} places)`;
        }
        markdown += `\n\n`;
      }

      if (session.speakers && session.speakers.length > 0) {
        markdown += `**Intervenants:**\n\n`;
        session.speakers.forEach((speaker) => {
          markdown += `- ${speaker.name}`;
          if (speaker.title || speaker.company) {
            markdown += ` - ${speaker.title || ''}${
              speaker.title && speaker.company ? ', ' : ''
            }${speaker.company || ''}`;
          }
          markdown += `\n`;
        });
        markdown += `\n`;
      }

      if (session.tags && session.tags.length > 0) {
        markdown += `**Tags:** ${session.tags.join(', ')}\n\n`;
      }

      markdown += `---\n\n`;
    });
  });

  return markdown;
}

/**
 * Export program to CSV format
 */
export function exportToCSV(sessions: Session[]): string {
  const headers = [
    'Date',
    'Heure début',
    'Heure fin',
    'Durée',
    'Titre',
    'Description',
    'Type',
    'Salle',
    'Capacité',
    'Intervenants',
    'Tags',
  ];

  let csv = headers.join(';') + '\n';

  sessions
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .forEach((session) => {
      const row = [
        formatDate(session.startTime),
        formatTime(session.startTime),
        formatTime(session.endTime),
        getDuration(session.startTime, session.endTime),
        escapeCsv(session.title),
        escapeCsv(session.description || ''),
        getTypeLabel(session.type),
        session.venueRoom?.name || '',
        session.maxCapacity?.toString() || '',
        session.speakers?.map((s) => s.name).join(', ') || '',
        session.tags?.join(', ') || '',
      ];

      csv += row.join(';') + '\n';
    });

  return csv;
}

/**
 * Export program to JSON format
 */
export function exportToJSON(sessions: Session[], eventName: string): string {
  return JSON.stringify(
    {
      event: eventName,
      exportDate: new Date().toISOString(),
      totalSessions: sessions.length,
      sessions: sessions.map((session) => ({
        id: session.id,
        title: session.title,
        description: session.description,
        type: session.type,
        startTime: session.startTime,
        endTime: session.endTime,
        room: session.venueRoom
          ? {
              id: session.venueRoom.id,
              name: session.venueRoom.name,
              capacity: session.venueRoom.capacity,
            }
          : null,
        maxCapacity: session.maxCapacity,
        speakers: session.speakers || [],
        tags: session.tags || [],
        isPublic: session.isPublic,
        language: session.language,
      })),
    },
    null,
    2
  );
}

/**
 * Download file in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper functions
function groupSessionsByDay(sessions: Session[]): Record<string, Session[]> {
  const grouped: Record<string, Session[]> = {};

  sessions.forEach((session) => {
    const day = new Date(session.startTime).toLocaleDateString('fr-FR');
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(session);
  });

  // Sort sessions within each day
  Object.keys(grouped).forEach((day) => {
    grouped[day].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  return grouped;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDuration(start: Date | string, end: Date | string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const minutes = (endDate.getTime() - startDate.getTime()) / 1000 / 60;

  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`;
}

function getTypeLabel(type: string): string {
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
}

function escapeCsv(str: string): string {
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
