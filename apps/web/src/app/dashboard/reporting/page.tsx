'use client';

import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporting</h1>
        <p className="text-muted-foreground">
          Analysez les statistiques de vos événements
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Événements totaux" value="0" />
        <StatCard title="Participants totaux" value="0" />
        <StatCard title="Taux de présence" value="0%" />
        <StatCard title="Satisfaction moyenne" value="N/A" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques détaillées</CardTitle>
          <CardDescription>
            Les graphiques et rapports détaillés seront disponibles ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Aucune donnée disponible</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Créez des événements et des participants pour voir les statistiques
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
