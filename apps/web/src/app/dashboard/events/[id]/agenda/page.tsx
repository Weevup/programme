import AgendaClient from './AgendaClient';

export function generateStaticParams() {
  return [
    { id: 'event-1' },
    { id: 'event-2' },
    { id: 'event-3' },
  ];
}

export default function AgendaPage() {
  return <AgendaClient />;
}
