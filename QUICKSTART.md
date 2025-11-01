# 🚀 Quick Start Guide - Event Platform MVP

## Prérequis

- Node.js 18+ et pnpm 8+
- Docker et Docker Compose
- Git

## Installation rapide

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Démarrer la base de données

```bash
docker-compose up -d
```

Cela démarre:
- PostgreSQL sur le port `5432`
- Redis sur le port `6379`

### 3. Configurer les variables d'environnement

**Backend (apps/api/.env):**
```bash
cp apps/api/.env.example apps/api/.env
# Le fichier .env est déjà configuré par défaut pour le développement local
```

**Frontend (apps/web/.env.local):**
```bash
cp apps/web/.env.local.example apps/web/.env.local
# Ajustez les valeurs si nécessaire
```

### 4. Générer le client Prisma et créer la base de données

```bash
cd packages/database
pnpm db:generate
pnpm db:push
```

### 5. Démarrer les applications

**Option A: Démarrer tous les services avec Turbo (recommandé)**
```bash
# À la racine du projet
pnpm dev
```

**Option B: Démarrer individuellement**

Terminal 1 - Backend:
```bash
cd apps/api
pnpm dev
```

Terminal 2 - Frontend:
```bash
cd apps/web
pnpm dev
```

## Accès aux applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation (Swagger)**: http://localhost:3001/api/docs
- **Prisma Studio**: `pnpm db:studio` (http://localhost:5555)

## Premiers pas

### 1. Créer un compte utilisateur

**Via API (curl):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@weevup.com",
    "password": "password123",
    "name": "Admin Weevup",
    "role": "ADMIN"
  }'
```

**Via Frontend:**
- Allez sur http://localhost:3000/register
- Remplissez le formulaire d'inscription

### 2. Se connecter

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@weevup.com",
    "password": "password123"
  }'
```

Sauvegardez le `accessToken` reçu pour les requêtes suivantes.

### 3. Créer votre premier événement

```bash
curl -X POST http://localhost:3001/api/v1/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Séminaire Tech 2024",
    "description": "Un événement de 2 jours sur les nouvelles technologies",
    "startDate": "2024-06-01T09:00:00Z",
    "endDate": "2024-06-02T18:00:00Z",
    "languages": ["fr", "en"],
    "budgetTotal": 50000
  }'
```

### 4. Ajouter un lieu (venue)

```bash
curl -X POST http://localhost:3001/api/v1/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Centre de Conférences Paris",
    "type": "CONFERENCE_CENTER",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "country": "France",
    "postalCode": "75001",
    "totalCapacity": 500,
    "rseScore": 85
  }'
```

## Commandes utiles

```bash
# Installer toutes les dépendances
pnpm install

# Démarrer tous les services en dev
pnpm dev

# Build tous les packages
pnpm build

# Lancer le linting
pnpm lint

# Formater le code
pnpm format

# Nettoyer tous les node_modules
pnpm clean

# Base de données
pnpm db:generate    # Générer le client Prisma
pnpm db:push        # Pousser le schéma vers la DB (dev)
pnpm db:migrate     # Créer une migration
pnpm db:studio      # Ouvrir Prisma Studio
```

## Structure du projet

```
event-platform/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/     # Module d'authentification
│   │   │   ├── events/   # Module événements
│   │   │   ├── venues/   # Module lieux
│   │   │   ├── sessions/ # Module sessions/agenda
│   │   │   └── participants/ # Module participants
│   │   └── .env
│   └── web/              # Frontend Next.js
│       ├── src/
│       │   ├── app/      # App Router (Next.js 14)
│       │   ├── components/ # Composants React
│       │   └── lib/      # Utilitaires (API client, etc.)
│       └── .env.local
├── packages/
│   ├── database/         # Prisma schema & client
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── types/            # Types TypeScript partagés
│   └── ui/               # Composants UI partagés (à venir)
├── docker-compose.yml    # PostgreSQL + Redis
├── turbo.json           # Configuration Turborepo
└── package.json         # Dépendances racine
```

## Modules MVP disponibles

### ✅ Implémentés

1. **Authentification** - JWT, Registration, Login
2. **Événements** - CRUD, statistiques, filtres
3. **Lieux (Venues)** - CRUD, recherche avancée, salles
4. **Sessions** - CRUD, speakers, conflits, feedback
5. **Participants** - CRUD, segments, check-in QR, import CSV

### 🔜 À venir (prochaines itérations)

- Interface web complète (dashboard, formulaires)
- Agenda Builder avec drag & drop
- Générateur de QR codes côté frontend
- Module de feedback & surveys
- Reporting avancé
- Système de notifications
- Module d'interactions (Q&A, polls, quiz)

## Troubleshooting

### La base de données ne démarre pas

```bash
# Arrêter et supprimer les conteneurs
docker-compose down -v

# Redémarrer
docker-compose up -d

# Vérifier les logs
docker-compose logs postgres
```

### Erreur Prisma "Cannot find module @prisma/client"

```bash
cd packages/database
pnpm db:generate
```

### Port déjà utilisé

Si les ports 3000, 3001, 5432 ou 6379 sont déjà utilisés, modifiez-les dans:
- `docker-compose.yml` (PostgreSQL, Redis)
- `apps/api/.env` (PORT, DATABASE_URL)
- `apps/web/.env.local` (API_URL)

## Prochaines étapes

1. Explorer l'API via Swagger: http://localhost:3001/api/docs
2. Créer des événements, lieux et sessions via l'API
3. Tester le système de check-in avec QR codes
4. Importer des participants via CSV

## Support

Pour toute question ou problème:
- Documentation API: http://localhost:3001/api/docs
- Prisma Studio: `pnpm db:studio`
- Logs Docker: `docker-compose logs -f`

---

**Bon développement ! 🚀**
