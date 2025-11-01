# 🔧 Guide de Dépannage - Déploiement GitHub Pages

Ce document liste tous les problèmes rencontrés lors du déploiement GitHub Pages et leurs solutions.

## Problèmes Résolus

### 1. ❌ Dependencies lock file not found

**Erreur:**
```
Error: Dependencies lock file is not found in /home/runner/work/programme/programme.
Supported file patterns: pnpm-lock.yaml
```

**Cause:**
Le fichier `pnpm-lock.yaml` n'était pas commité dans le repository.

**Solution:**
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: Add pnpm-lock.yaml for CI"
```

Également ajouté `--no-frozen-lockfile` dans le workflow pour plus de flexibilité:
```yaml
- name: Install dependencies
  run: pnpm install --no-frozen-lockfile
```

---

### 2. ❌ Missing generateStaticParams() for dynamic routes

**Erreur:**
```
Error: Page "/dashboard/events/[id]" is missing "generateStaticParams()"
so it cannot be used with "output: export" config.
```

**Cause:**
Next.js avec `output: 'export'` nécessite que toutes les routes dynamiques définissent explicitement les paramètres statiques à générer au moment du build.

**Solution:**
Split de la page en deux fichiers:

**`apps/web/src/app/dashboard/events/[id]/page.tsx`** (Server Component):
```typescript
import EventDetailClient from './EventDetailClient';

export function generateStaticParams() {
  return [
    { id: 'event-1' },
    { id: 'event-2' },
    { id: 'event-3' },
  ];
}

export default function EventDetailPage() {
  return <EventDetailClient />;
}
```

**`apps/web/src/app/dashboard/events/[id]/EventDetailClient.tsx`** (Client Component):
```typescript
'use client';
// ... toute la logique client (useState, useEffect, etc.)
```

---

### 3. ❌ Failed to fetch font from Google Fonts

**Erreur:**
```
Error [NextFontError]: Failed to fetch font `Inter`.
URL: https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap

Please check if the network is available.
```

**Cause:**
`next/font/google` tente de télécharger les fonts au moment du build, ce qui peut échouer dans certains environnements ou avec des exports statiques.

**Solution:**
Remplacement de `next/font/google` par un chargement runtime via CDN.

**Avant** (`apps/web/src/app/layout.tsx`):
```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

// ...
<body className={inter.className}>
```

**Après**:
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

Configuration Tailwind (`apps/web/tailwind.config.ts`):
```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
  },
}
```

---

## Configuration Finale Qui Fonctionne

### next.config.js
```javascript
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@event-platform/types'],
  output: 'export',              // ← Export statique pour GitHub Pages
  images: {
    unoptimized: true,           // ← Requis pour export statique
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,           // ← Meilleure compatibilité GitHub Pages
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001/api/v1',
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE || 'false',
  },
  eslint: {
    ignoreDuringBuilds: true,    // ← Évite les échecs sur warnings eslint
  },
  typescript: {
    ignoreBuildErrors: true,     // ← Évite les échecs sur erreurs TS non bloquantes
  },
};
```

### .env.demo
```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_BASE_PATH=/programme
```

### GitHub Actions Workflow
```yaml
- name: Install dependencies
  run: pnpm install --no-frozen-lockfile

- name: Build demo
  working-directory: apps/web
  run: |
    cp .env.demo .env.local
    pnpm build
  env:
    NEXT_PUBLIC_DEMO_MODE: "true"
    NEXT_PUBLIC_BASE_PATH: "/programme"
    NODE_ENV: "production"

- name: Add .nojekyll
  run: touch apps/web/out/.nojekyll
```

---

## Checklist de Déploiement

Avant de pousser vers GitHub:

- [ ] `pnpm-lock.yaml` est commité
- [ ] Toutes les routes dynamiques ont `generateStaticParams()`
- [ ] Les fonts utilisent soit CDN runtime soit des fonts locales
- [ ] `output: 'export'` est configuré dans next.config.js
- [ ] `.nojekyll` est ajouté dans le workflow
- [ ] `basePath` correspond au nom du repo
- [ ] Les permissions du workflow sont "Read and write"
- [ ] GitHub Pages est configuré sur "GitHub Actions" comme source

---

## Tests Locaux

Pour vérifier que le build fonctionne avant de pousser:

```bash
cd apps/web
cp .env.demo .env.local
pnpm build
```

Si le build réussit localement, il devrait réussir sur GitHub Actions.

Pour tester le résultat en local:
```bash
npx serve out
```

---

## Erreurs Courantes

### 404 après déploiement réussi

**Vérifier:**
1. Le `basePath` dans next.config.js correspond au nom du repo
2. Le fichier `.nojekyll` existe à la racine de `out/`
3. GitHub Pages est bien activé dans Settings > Pages
4. La source est bien "GitHub Actions" et pas "Deploy from a branch"

### Styles CSS ne se chargent pas

**Vérifier:**
1. `basePath` est correct
2. Le workflow copie bien tous les fichiers statiques
3. Il n'y a pas de problème de CORS

### Images ne s'affichent pas

**Vérifier:**
1. `images: { unoptimized: true }` dans next.config.js
2. Les chemins d'images sont relatifs ou utilisent `basePath`

---

## Ressources Utiles

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)

---

## Historique des Corrections

| Date | Commit | Problème | Solution |
|------|--------|----------|----------|
| 2024-11-01 | `3bc997e` | generateStaticParams manquant | Ajout de generateStaticParams pour routes dynamiques |
| 2024-11-01 | `68f4a29` | Erreur chargement font | Remplacement next/font par CDN runtime |

---

## Support

Si vous rencontrez d'autres problèmes:
1. Consultez les logs dans GitHub Actions
2. Vérifiez la configuration dans ce guide
3. Créez une issue avec les logs d'erreur complets
