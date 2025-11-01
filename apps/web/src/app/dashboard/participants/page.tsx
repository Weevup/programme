'use client';

import { useState } from 'react';
import { Plus, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ParticipantsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
          <p className="text-muted-foreground">
            Gérez les participants de vos événements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importer CSV
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau participant
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Sélectionnez un événement</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Choisissez un événement pour voir ses participants
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
