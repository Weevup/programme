import type { SessionDocument, SessionQuestion, SessionFeedback } from '@/types/agenda';

// ============================================
// DOCUMENTS EXEMPLES
// ============================================

export const demoDocuments: SessionDocument[] = [
  {
    id: 'doc-001',
    sessionId: 'cong-s002',
    nom: 'Présentation - Insuffisance Cardiaque.pdf',
    type: 'pdf',
    url: '/documents/demo/presentation-cardio.pdf',
    taille: 2457600, // 2.4 MB
    description: 'Slides de la présentation complète',
    ordre: 1,
    estPublic: true,
    createdAt: new Date('2024-10-14T10:00:00'),
  },
  {
    id: 'doc-002',
    sessionId: 'cong-s002',
    nom: 'Étude de cas - Patients 2024.xlsx',
    type: 'xlsx',
    url: '/documents/demo/etude-cas.xlsx',
    taille: 567890,
    description: 'Données anonymisées de l\'étude',
    ordre: 2,
    estPublic: false,
    createdAt: new Date('2024-10-14T11:30:00'),
  },
  {
    id: 'doc-003',
    sessionId: 'cong-s003',
    nom: 'Guide pratique - Immunothérapie.pdf',
    type: 'pdf',
    url: '/documents/demo/guide-immunotherapie.pdf',
    taille: 3456789,
    description: 'Guide complet pour les praticiens',
    ordre: 1,
    estPublic: true,
    createdAt: new Date('2024-10-14T14:00:00'),
  },
  {
    id: 'doc-004',
    sessionId: 'cong-s004',
    nom: 'Atelier - Simulation clinique.pptx',
    type: 'pptx',
    url: '/documents/demo/atelier-simulation.pptx',
    taille: 8900123,
    description: 'Support de l\'atelier pratique',
    ordre: 1,
    estPublic: true,
    createdAt: new Date('2024-10-14T15:30:00'),
  },
  {
    id: 'doc-005',
    sessionId: 'cong-s004',
    nom: 'Vidéo - Démonstration technique',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Démonstration vidéo de la technique',
    ordre: 2,
    estPublic: true,
    createdAt: new Date('2024-10-14T16:00:00'),
  },
];

// ============================================
// QUESTIONS Q&A EXEMPLES
// ============================================

export const demoQuestions: SessionQuestion[] = [
  {
    id: 'q-001',
    sessionId: 'cong-s002',
    participantId: 'part-123',
    participantName: 'Dr. Marie Dupont',
    participantPhoto: 'https://i.pravatar.cc/150?img=1',
    question: 'Quels sont les résultats à long terme (>5 ans) de cette nouvelle approche thérapeutique ?',
    likes: 15,
    isAnswered: true,
    reponse: 'Les études de suivi montrent des résultats prometteurs avec une amélioration de 40% de la qualité de vie après 5 ans.',
    isModerated: true,
    createdAt: new Date('2024-10-15T10:15:00'),
    updatedAt: new Date('2024-10-15T10:30:00'),
  },
  {
    id: 'q-002',
    sessionId: 'cong-s002',
    participantId: 'part-456',
    participantName: 'Dr. Jean Martin',
    participantPhoto: 'https://i.pravatar.cc/150?img=2',
    question: 'Y a-t-il des contre-indications spécifiques pour les patients âgés de plus de 75 ans ?',
    likes: 12,
    isAnswered: true,
    reponse: 'Oui, nous recommandons une surveillance renforcée pour les patients de plus de 75 ans, notamment en cas de comorbidités rénales.',
    isModerated: true,
    createdAt: new Date('2024-10-15T10:20:00'),
    updatedAt: new Date('2024-10-15T10:35:00'),
  },
  {
    id: 'q-003',
    sessionId: 'cong-s002',
    participantId: 'part-789',
    participantName: 'Dr. Sophie Laurent',
    participantPhoto: 'https://i.pravatar.cc/150?img=5',
    question: 'Comment gérez-vous les interactions médicamenteuses avec les anticoagulants ?',
    likes: 8,
    isAnswered: false,
    isModerated: true,
    createdAt: new Date('2024-10-15T10:45:00'),
  },
  {
    id: 'q-004',
    sessionId: 'cong-s003',
    participantId: 'part-234',
    participantName: 'Dr. Pierre Bernard',
    participantPhoto: 'https://i.pravatar.cc/150?img=12',
    question: 'Quelle est la tolérance des patients aux nouveaux protocoles d\'immunothérapie ?',
    likes: 20,
    isAnswered: true,
    reponse: 'Les données montrent une tolérance globalement bonne, avec 85% des patients complétant le protocole complet.',
    isModerated: true,
    createdAt: new Date('2024-10-15T14:10:00'),
    updatedAt: new Date('2024-10-15T14:25:00'),
  },
  {
    id: 'q-005',
    sessionId: 'cong-s003',
    participantId: 'part-567',
    participantName: 'Dr. Anne Dubois',
    participantPhoto: 'https://i.pravatar.cc/150?img=9',
    question: 'Avez-vous des données sur l\'efficacité chez les patients immunodéprimés ?',
    likes: 14,
    isAnswered: false,
    isModerated: true,
    createdAt: new Date('2024-10-15T14:30:00'),
  },
];

// ============================================
// FEEDBACKS/ÉVALUATIONS EXEMPLES
// ============================================

export const demoFeedbacks: SessionFeedback[] = [
  {
    id: 'fb-001',
    sessionId: 'cong-s002',
    participantId: 'part-111',
    rating: 5,
    commentaire: 'Présentation excellente et très instructive. Les cas cliniques étaient pertinents et bien expliqués.',
    aspects: {
      contenu: 5,
      orateur: 5,
      organisation: 4,
    },
    createdAt: new Date('2024-10-15T12:00:00'),
  },
  {
    id: 'fb-002',
    sessionId: 'cong-s002',
    participantId: 'part-222',
    rating: 4,
    commentaire: 'Très bon contenu scientifique. J\'aurais aimé plus de temps pour les questions.',
    aspects: {
      contenu: 5,
      orateur: 4,
      organisation: 3,
    },
    createdAt: new Date('2024-10-15T12:05:00'),
  },
  {
    id: 'fb-003',
    sessionId: 'cong-s002',
    participantId: 'part-333',
    rating: 5,
    commentaire: 'Intervenante captivante ! Les données présentées sont très encourageantes.',
    aspects: {
      contenu: 5,
      orateur: 5,
      organisation: 5,
    },
    createdAt: new Date('2024-10-15T12:10:00'),
  },
  {
    id: 'fb-004',
    sessionId: 'cong-s002',
    participantId: 'part-444',
    rating: 4,
    commentaire: 'Bonne session, mais la salle était un peu petite pour le nombre de participants.',
    aspects: {
      contenu: 5,
      orateur: 4,
      organisation: 3,
    },
    createdAt: new Date('2024-10-15T12:15:00'),
  },
  {
    id: 'fb-005',
    sessionId: 'cong-s002',
    participantId: 'part-555',
    rating: 3,
    commentaire: 'Intéressant mais trop technique pour moi. Aurait été mieux avec plus de contexte clinique.',
    aspects: {
      contenu: 3,
      orateur: 4,
      organisation: 4,
    },
    createdAt: new Date('2024-10-15T12:20:00'),
  },
  {
    id: 'fb-006',
    sessionId: 'cong-s003',
    participantId: 'part-666',
    rating: 5,
    commentaire: 'Session exceptionnelle ! Dr. Chen est un expert reconnu et cela se voit.',
    aspects: {
      contenu: 5,
      orateur: 5,
      organisation: 5,
    },
    createdAt: new Date('2024-10-15T15:30:00'),
  },
  {
    id: 'fb-007',
    sessionId: 'cong-s003',
    participantId: 'part-777',
    rating: 5,
    commentaire: 'Approche innovante et résultats impressionnants. Merci pour cette présentation !',
    aspects: {
      contenu: 5,
      orateur: 5,
      organisation: 4,
    },
    createdAt: new Date('2024-10-15T15:35:00'),
  },
  {
    id: 'fb-008',
    sessionId: 'cong-s003',
    participantId: 'part-888',
    rating: 4,
    commentaire: 'Très prometteuse comme approche thérapeutique. Hâte de voir les résultats à long terme.',
    aspects: {
      contenu: 5,
      orateur: 4,
      organisation: 4,
    },
    createdAt: new Date('2024-10-15T15:40:00'),
  },
  {
    id: 'fb-009',
    sessionId: 'cong-s004',
    participantId: 'part-999',
    rating: 5,
    commentaire: 'Atelier fantastique ! La partie pratique était très enrichissante.',
    aspects: {
      contenu: 5,
      orateur: 5,
      organisation: 5,
    },
    createdAt: new Date('2024-10-15T17:00:00'),
  },
  {
    id: 'fb-010',
    sessionId: 'cong-s004',
    participantId: 'part-1010',
    rating: 4,
    commentaire: 'Bon atelier, mais j\'aurais aimé plus de temps pour pratiquer.',
    aspects: {
      contenu: 4,
      orateur: 5,
      organisation: 3,
    },
    createdAt: new Date('2024-10-15T17:05:00'),
  },
];

// Fonction helper pour calculer les stats de feedback
export function calculateFeedbackStats(sessionId: string) {
  const sessionFeedbacks = demoFeedbacks.filter((fb) => fb.sessionId === sessionId);

  if (sessionFeedbacks.length === 0) {
    return {
      averageRating: 0,
      totalFeedbacks: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalRating = sessionFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  const averageRating = totalRating / sessionFeedbacks.length;

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  sessionFeedbacks.forEach((fb) => {
    ratingDistribution[fb.rating]++;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalFeedbacks: sessionFeedbacks.length,
    ratingDistribution,
  };
}

// Fonction helper pour obtenir les questions d'une session
export function getSessionQuestions(sessionId: string): SessionQuestion[] {
  return demoQuestions
    .filter((q) => q.sessionId === sessionId)
    .sort((a, b) => b.likes - a.likes);
}

// Fonction helper pour obtenir les feedbacks d'une session
export function getSessionFeedbacks(sessionId: string): SessionFeedback[] {
  return demoFeedbacks
    .filter((fb) => fb.sessionId === sessionId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Fonction helper pour obtenir les documents d'une session
export function getSessionDocuments(sessionId: string): SessionDocument[] {
  return demoDocuments
    .filter((doc) => doc.sessionId === sessionId)
    .sort((a, b) => a.ordre - b.ordre);
}
