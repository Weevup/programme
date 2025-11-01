import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Event Platform MVP</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Plateforme unique pour la gestion complète d'événements professionnels
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">S'inscrire</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard
          title="Venue Finder"
          description="Référentiel de lieux et partenaires avec recherche avancée"
          icon="🏢"
        />
        <FeatureCard
          title="Agenda Builder"
          description="Création de programmes multi-jours/salles avec drag & drop"
          icon="📅"
        />
        <FeatureCard
          title="Gestion de listes"
          description="Import CSV, segmentation, invitations automatisées"
          icon="👥"
        />
        <FeatureCard
          title="Check-in"
          description="Système QR code pour le contrôle d'accès"
          icon="✅"
        />
        <FeatureCard
          title="Feedback & Surveys"
          description="Évaluation des sessions et enquêtes de satisfaction"
          icon="📊"
        />
        <FeatureCard
          title="Reporting"
          description="Statistiques et exports"
          icon="📈"
        />
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
