import EventDetailClient from './EventDetailClient';

// Generate static params for demo events
export function generateStaticParams() {
  return [
    { id: 'event-1' },
    { id: 'event-2' },
    { id: 'event-3' },
    { id: 'event-congress-2024' },
    { id: 'event-techconnect-2024' },
  ];
}

export default function EventDetailPage() {
  return <EventDetailClient />;
}
