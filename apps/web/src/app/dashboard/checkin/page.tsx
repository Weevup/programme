'use client';

import { useState } from 'react';
import { QrCode, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export default function CheckInPage() {
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState('');
  const [participant, setParticipant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchByQR = async () => {
    if (!qrCode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez scanner ou entrer un code QR',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Search for participant by QR code
      const response = await api.get(`/participants/qr/${qrCode}`);
      setParticipant(response.data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Participant introuvable avec ce code QR',
      });
      setParticipant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!participant) return;

    setIsLoading(true);

    try {
      await api.post('/participants/check-in', {
        eventId: participant.eventId,
        qrCode: qrCode,
      });

      toast({
        title: 'Check-in effectué',
        description: `${participant.firstName} ${participant.lastName} a été enregistré`,
      });

      // Reset
      setQrCode('');
      setParticipant(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible d\'effectuer le check-in',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Check-in</h1>
        <p className="text-muted-foreground">
          Scannez les codes QR pour enregistrer les participants
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle>Scanner QR Code</CardTitle>
            <CardDescription>
              Scannez le code QR du participant ou entrez-le manuellement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <QrCode className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Positionnez le code QR devant la caméra
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Ou entrez le code QR manuellement"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchByQR();
                  }
                }}
              />
              <Button
                onClick={handleSearchByQR}
                disabled={isLoading || !qrCode.trim()}
                className="w-full"
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Participant Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du participant</CardTitle>
            <CardDescription>
              Vérifiez les informations avant de valider le check-in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!participant ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Aucun participant sélectionné
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {participant.firstName} {participant.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{participant.email}</p>
                </div>

                {participant.company && (
                  <div>
                    <p className="text-sm font-medium">Société</p>
                    <p className="text-sm text-muted-foreground">{participant.company}</p>
                  </div>
                )}

                {participant.jobTitle && (
                  <div>
                    <p className="text-sm font-medium">Poste</p>
                    <p className="text-sm text-muted-foreground">{participant.jobTitle}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-sm text-muted-foreground">{participant.role}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <p className="text-sm text-muted-foreground">{participant.status}</p>
                </div>

                <Button
                  onClick={handleCheckIn}
                  disabled={isLoading || participant.status === 'CHECKED_IN'}
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {participant.status === 'CHECKED_IN'
                    ? 'Déjà enregistré'
                    : 'Valider le check-in'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Check-ins récents</CardTitle>
          <CardDescription>Liste des derniers participants enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucun check-in récent</p>
        </CardContent>
      </Card>
    </div>
  );
}
