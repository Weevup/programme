'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export default function VenuesPage() {
  const { toast } = useToast();
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    minCapacity: '',
  });

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const response = await api.get('/venues', {
        params: {
          page: 1,
          pageSize: 20,
          query: searchQuery,
          ...filters,
        },
      });
      setVenues(response.data.data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les lieux',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadVenues();
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Finder</h1>
          <p className="text-muted-foreground">
            Recherchez et gérez vos lieux d'événements
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/venues/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau lieu
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche</CardTitle>
          <CardDescription>Filtrez les lieux selon vos critères</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Ville"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">Tous les types</option>
                  <option value="CONFERENCE_CENTER">Centre de conférences</option>
                  <option value="HOTEL">Hôtel</option>
                  <option value="OUTDOOR">Extérieur</option>
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="MUSEUM">Musée</option>
                  <option value="THEATER">Théâtre</option>
                </select>
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Capacité min."
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {venues.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun lieu trouvé</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajustez vos critères de recherche ou créez un nouveau lieu
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}

function VenueCard({ venue }: { venue: any }) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CONFERENCE_CENTER: 'Centre de conférences',
      HOTEL: 'Hôtel',
      OUTDOOR: 'Extérieur',
      RESTAURANT: 'Restaurant',
      MUSEUM: 'Musée',
      THEATER: 'Théâtre',
      OTHER: 'Autre',
    };
    return labels[type] || type;
  };

  return (
    <Link href={`/dashboard/venues/${venue.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1">{venue.name}</CardTitle>
            {venue.rseScore && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                RSE {venue.rseScore}/100
              </span>
            )}
          </div>
          <CardDescription>{getTypeLabel(venue.type)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {venue.city}, {venue.country}
            </div>
            {venue.totalCapacity && (
              <div className="text-muted-foreground">
                Capacité: {venue.totalCapacity} personnes
              </div>
            )}
            <div className="text-muted-foreground">
              {venue.rooms?.length || 0} salle(s)
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
