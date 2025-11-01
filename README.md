# Event Platform MVP - Weevup

Plateforme unique pour la gestion complète d'événements professionnels.

## 🎯 Fonctionnalités MVP

- **Venue Finder**: Référentiel de lieux et partenaires avec recherche avancée
- **Agenda Builder**: Création de programmes multi-jours/salles avec drag & drop
- **Gestion de listes**: Import CSV, segmentation, invitations automatisées
- **Check-in**: Système QR code pour le contrôle d'accès
- **Feedback & Surveys**: Évaluation des sessions et enquêtes de satisfaction
- **Reporting**: Statistiques et exports

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

## 🚀 Démarrage

```bash
# Installation
pnpm install

# Développement
pnpm dev

# Build
pnpm build

# Lancer la base de données (Docker)
docker-compose up -d

# Migrations
pnpm db:migrate

# Prisma Studio
pnpm db:studio
```

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
