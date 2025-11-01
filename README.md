# Event Platform MVP - Weevup

Plateforme unique pour la gestion complète d'événements professionnels.

## 🎯 Fonctionnalités MVP

### ✅ Fonctionnalités implémentées

**Backend (API REST complète):**
- **Authentification**: JWT, login/register, RBAC
- **Événements**: CRUD complet, statistiques, filtres
- **Lieux (Venues)**: Référentiel avec recherche multicritères, gestion des salles, score RSE
- **Sessions**: Programme événements, speakers, détection de conflits
- **Participants**: CRUD, import CSV, segmentation, check-in QR codes
- **Feedback**: Évaluations de sessions et surveys

**Frontend (Interfaces web):**
- **Authentification**: Pages login/register fonctionnelles
- **Dashboard**: Vue d'ensemble avec navigation et statistiques
- **Gestion d'événements**: Liste, création, détails, modification
- **Venue Finder**: Recherche avancée de lieux avec filtres
- **Check-in**: Interface de scan QR code et validation
- **Participants**: Interface de gestion (base)
- **Reporting**: Dashboard statistiques (base)

## 🏗️ Architecture

Monorepo avec Turborepo:
```
apps/
  ├── web/          # Next.js 14 frontend
  └── api/          # NestJS backend
packages/
  ├── database/     # Prisma schema & migrations
  ├── ui/           # Shared UI components (shadcn/ui)
  └── types/        # Shared TypeScript types
```

## 🛠️ Stack Technique

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Prisma, PostgreSQL, Redis
- **Auth**: NextAuth.js (OAuth + JWT)
- **Tooling**: Turborepo, pnpm, ESLint, Prettier

## 🚀 Démarrage rapide

**Voir le guide complet dans [QUICKSTART.md](./QUICKSTART.md)**

```bash
# 1. Installer les dépendances
pnpm install

# 2. Lancer PostgreSQL et Redis
docker-compose up -d

# 3. Générer le client Prisma et créer la DB
cd packages/database
pnpm db:generate
pnpm db:push

# 4. Démarrer tous les services
cd ../..
pnpm dev
```

**Applications:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger docs: http://localhost:3001/api/docs

## 📦 Commandes utiles

```bash
pnpm dev              # Lance tous les services en mode dev
pnpm build            # Build tous les packages
pnpm lint             # Lint tous les packages
pnpm format           # Format le code avec Prettier
pnpm clean            # Nettoie tous les node_modules et caches
```

## 🔐 Sécurité & Conformité

- SSO (Google/Microsoft OAuth)
- RBAC (Role-Based Access Control)
- Chiffrement AES-256 au repos, TLS en transit
- RGPD by design (consentement, droit à l'oubli, export de données)

## 📄 License

Propriétaire - Weevup
