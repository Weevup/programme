# 🎬 Démo en ligne - Event Platform MVP

## 🌐 Accès à la démo

Une fois déployée, la démo sera accessible à :

**https://weevup.github.io/programme/**

## ✨ Mode Démo

Cette version utilise des **données mockées** pour démontrer toutes les fonctionnalités sans backend :

### Données disponibles

**Utilisateur démo:**
- Email: demo@weevup.com
- Nom: Démo Weevup
- Rôle: ADMIN

**3 événements de démo:**
1. **Séminaire Tech 2024** (Publié)
   - 245 participants
   - 18 sessions
   - 2 lieux

2. **Convention Innovation 2024** (Brouillon)
   - Événement en préparation

3. **Roadshow Paris 2024** (Terminé)
   - 156 participants
   - 8 sessions

**3 lieux disponibles:**
1. Centre de Conférences Paris La Défense (Score RSE: 92)
2. Hôtel Royal Monceau (Score RSE: 78)
3. Palais des Congrès de Lyon (Score RSE: 88)

**Participant de démo pour check-in:**
- QR Code: `QR-DEMO-12345`
- Nom: Jean Dupont
- Entreprise: TechCorp

## 🎮 Fonctionnalités testables

### 1. Authentification
- Login (n'importe quel email/mot de passe fonctionne)
- Register (création de compte simulée)

### 2. Dashboard
- Vue d'ensemble avec statistiques
- Navigation responsive

### 3. Gestion d'événements
- Liste des 3 événements de démo
- Création d'un nouvel événement (sera ajouté temporairement)
- Consultation des détails avec onglets
- Statistiques en temps réel
- Suppression d'événement

### 4. Venue Finder
- Recherche avec filtres (ville, type, capacité)
- Affichage des 3 lieux
- Création de nouveau lieu (temporaire)
- Visualisation des scores RSE

### 5. Check-in
- Scanner QR (interface)
- Entrer le code manuellement: `QR-DEMO-12345`
- Affichage des informations participant
- Validation du check-in

### 6. Participants & Reporting
- Interfaces de base visibles

## ⚠️ Limitations du mode démo

- **Pas de persistance**: Les données sont réinitialisées à chaque rechargement
- **Pas de backend réel**: Toutes les requêtes API sont simulées
- **Scanner QR visuel**: Interface seulement, pas de vraie caméra
- **Import CSV**: Bouton visible mais non fonctionnel

## 🔧 Déploiement

### GitHub Actions

Le déploiement est automatique sur chaque push vers la branche principale :

```yaml
1. Installation des dépendances (pnpm)
2. Build en mode démo (NEXT_PUBLIC_DEMO_MODE=true)
3. Upload vers GitHub Pages
4. Déploiement automatique
```

### Build manuel local

```bash
cd apps/web
pnpm build:demo
```

Les fichiers statiques seront générés dans `apps/web/out/`

### Configuration

Variables d'environnement pour le build de démo:
```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_BASE_PATH=/programme
```

## 🚀 Différences avec la version production

| Fonctionnalité | Démo | Production |
|----------------|------|------------|
| Backend API | Mock (client-side) | NestJS réel |
| Base de données | Données en mémoire | PostgreSQL |
| Authentification | Simulée | JWT réel |
| Persistance | Non | Oui |
| Check-in QR | Interface seulement | Caméra réelle |
| Import CSV | Non fonctionnel | Parser CSV |
| Temps réel | Simulé (500ms delay) | API réelle |

## 📝 Notes techniques

- **Next.js Static Export**: `output: 'export'` dans next.config.js
- **Images**: `unoptimized: true` pour compatibilité static
- **Base Path**: `/programme` pour GitHub Pages
- **Client-side routing**: Toute la navigation est côté client
- **Mock API**: Implémentée dans `src/lib/api.ts`
- **Données**: Définies dans `src/lib/demo-data.ts`

## 🔗 Liens utiles

- [Code source](https://github.com/Weevup/programme)
- [Documentation](./README.md)
- [Guide de démarrage](./QUICKSTART.md)
- [Changelog](./CHANGELOG.md)

## 💡 Pour tester la version complète

Pour tester avec le backend réel:

```bash
# 1. Cloner le repo
git clone https://github.com/Weevup/programme.git
cd programme

# 2. Installer les dépendances
pnpm install

# 3. Lancer Docker (PostgreSQL + Redis)
docker-compose up -d

# 4. Setup database
cd packages/database
pnpm db:generate
pnpm db:push

# 5. Démarrer l'application
cd ../..
pnpm dev
```

Voir [QUICKSTART.md](./QUICKSTART.md) pour plus de détails.
