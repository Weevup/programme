# 📚 Exemples d'Événements Complexes

Ce document explique où trouver et comment utiliser les exemples d'événements complexes qui démontrent toutes les fonctionnalités de la plateforme.

**✅ Mis à jour** : Les exemples sont maintenant déployés sur GitHub Pages !

## 🔍 Où trouver les exemples ?

### Dans le code

Les exemples sont définis dans le fichier :
```
apps/web/src/lib/demo-complex-events.ts
```

Ce fichier contient **2 événements complexes complets** avec toutes leurs données (tracks, journées, sessions, contraintes, etc.)

### Dans l'application web

Les exemples sont automatiquement disponibles dans l'interface web :

1. **Page de liste des événements** : `/dashboard/events`
   - Vous y verrez 5 événements au total, dont les 2 exemples complexes

2. **URLs directes des exemples** :

#### 🏥 Congrès Médical 2024
- **Liste** : http://localhost:3000/dashboard/events
- **Détails** : http://localhost:3000/dashboard/events/event-congress-2024
- **Programme/Agenda** : http://localhost:3000/dashboard/events/event-congress-2024/agenda

#### 💼 TechConnect Summit 2024
- **Liste** : http://localhost:3000/dashboard/events
- **Détails** : http://localhost:3000/dashboard/events/event-techconnect-2024
- **Programme/Agenda** : http://localhost:3000/dashboard/events/event-techconnect-2024/agenda

## 📋 Événement 1 : Congrès Mondial de Médecine 2024

### Caractéristiques
- 🗓️ **Dates** : 15-17 octobre 2024 (3 jours)
- 👥 **Participants** : 3 200 personnes
- 🎯 **Sessions** : 120+ sessions
- 🎨 **Tracks** : 8 parcours thématiques
- 🌍 **Langues** : FR, EN, ES, DE
- 💰 **Budget** : 850 000€

### Fonctionnalités démontrées

#### Tracks (8)
- ❤️ Cardiologie
- 🎗️ Oncologie
- 🧠 Neurologie
- 👶 Pédiatrie
- 📸 Imagerie Médicale
- 🤖 IA & Santé Numérique
- 🔬 Chirurgie
- 🌍 Santé Publique

#### Segments d'audience (6)
- Médecins
- Chercheurs
- Personnel Soignant
- VIP (Professeurs & Chefs de service)
- Industrie Pharmaceutique
- International

#### Sessions exemplaires

1. **Cérémonie d'ouverture** (session-id: `cong-s001`)
   - 1200 personnes
   - Logistique lourde (120min de montage)
   - Livestream + traduction simultanée FR/EN/ES

2. **Masterclass VIP: Chirurgie Robotique** (`cong-s007`)
   - ✨ `accesPremium: true` - Accès VIP uniquement
   - 50 places
   - Simulateur Da Vinci
   - 90min de montage technique

3. **IA Avancée: Deep Learning** (`cong-s008`)
   - ⚡ `prerequis: ['cong-s005']` - Nécessite session de base
   - 50 laptops avec GPU
   - Dataset 500GB

4. **Sessions multilingues**
   - Sessions en FR, EN, ES, DE
   - Traduction simultanée
   - Segments internationaux

#### Contraintes (5)
1. Pause minimale (15min entre sessions)
2. Capacité maximale (95% pour sécurité)
3. Couvre-feu (fin avant 20h)
4. Temps montage/démontage
5. Sessions VIP sans chevauchement

#### Versioning
- Version actuelle : `v3.2.1`
- Version précédente : `v3.2.0`
- Changelog disponible
- Publications ciblées par segment

### Accéder aux données

```typescript
import {
  congressProgramme,
  congressJournees,
  congressTracks,
  congressSegments,
  congressSessions,
  congressContraintes,
  congressVersions,
  congressPublications,
} from '@/lib/demo-complex-events';
```

## 💼 Événement 2 : TechConnect Summit 2024

### Caractéristiques
- 🗓️ **Dates** : 20-22 novembre 2024 (3 jours)
- 👥 **Participants** : 1 500 personnes
- 🎯 **Sessions** : 45 sessions
- 🎨 **Tracks** : 4 parcours B2B
- 🌍 **Langues** : FR, EN
- 💰 **Budget** : 450 000€

### Fonctionnalités démontrées

#### Tracks (4)
- ☁️ SaaS & Cloud
- 💰 FinTech
- 🔒 Cybersécurité
- 🤖 IA & Data

#### Segments professionnels (4)
- C-Level (CEO, CTO, CFO)
- Investisseurs (VCs, Business Angels)
- Startups (fondateurs)
- Entreprises (grandes entreprises, ETI)

#### Sessions exemplaires

1. **Setup & Installation Expo** (`tc-s001`)
   - 🔒 `isPublic: false` - Équipe technique uniquement
   - 🚫 `segmentsExclus` - Tous les participants exclus
   - 6h-9h du matin
   - Logistique lourde : 20 chariots élévateurs, 150 caisses
   - 240min de démontage

2. **Keynote SaaS** (`tc-s002`)
   - 2000 personnes
   - Speakers : Mathilde Collin (Front), Jonathan Anguelov (Aircall)
   - Scène 15m×8m
   - Livestream 4K + traduction EN/FR

3. **Workshop FinTech Compliant** (`tc-s003`)
   - 📝 `inscriptionRequise: true`
   - 👥 `segmentsAutorises: ['tc-seg-ceo', 'tc-seg-startup']`
   - Documents confidentiels - NDA requis
   - 80 tablettes avec cas pratiques

4. **Speed Networking** (`tc-s004`)
   - 🤝 Format matchmaking B2B
   - 20min par rendez-vous
   - 100 tables rondes
   - Système de rotation automatisé
   - App mobile + QR codes

5. **Startup Pitch Competition** (`tc-s005`)
   - 🏆 Prix : 100k€
   - 10 startups, 7min pitch + 3min Q&A
   - Timing STRICT
   - Vote en direct
   - Multi-caméras

#### Contraintes (3)
1. Networking sans chevauchement
2. Matchmaking requiert inscription
3. Buffer 30min entre setup et ouverture

### Accéder aux données

```typescript
import {
  techConnectProgramme,
  techConnectJournees,
  techConnectTracks,
  techConnectSegments,
  techConnectSessions,
  techConnectContraintes,
} from '@/lib/demo-complex-events';
```

## 🎯 Fonctionnalités complètes démontrées

### ✅ Gestion d'accès
- **Access Premium** - Sessions VIP exclusives
- **Segments autorisés** - Liste blanche d'accès
- **Segments exclus** - Liste noire
- **Public/Privé** - Contrôle de visibilité

### ✅ Logistique
- **Temps de montage** - 0 à 120 minutes
- **Temps de démontage** - Jusqu'à 240 minutes
- **Ressources** - Liste exhaustive d'équipements
- **Instructions** - Notes opérationnelles critiques

### ✅ Interactions
- **Q&A** - Questions-réponses en direct
- **Quiz** - Quiz interactifs
- **Sondages** - Votes en temps réel
- **Wordcloud** - Nuages de mots

### ✅ Prérequis & Dépendances
- **Prérequis** - Sessions à avoir suivi avant
- **Inscription requise** - Réservation obligatoire

### ✅ Capacité
- **Capacité max** - Limite physique
- **Inscriptions actuelles** - Suivi en temps réel
- **Taux de remplissage** - 298/300, 1847/2000, etc.

### ✅ Multilingue
- Support FR, EN, ES, DE
- Traduction simultanée
- Segments par langue

### ✅ Contraintes configurables
- 8 contraintes au total
- 3 niveaux de sévérité (error, warning, info)
- 5 types (temps_pause, capacite_max, heure_limite, montage_demonte, custom)

### ✅ Versioning & Publication
- Historique de versions
- Snapshots complets
- Publications ciblées
- Accès anticipé VIP
- Multi-canaux (web, mobile, calendrier, PDF)

## 🚀 Comment utiliser ces exemples

### 1. Démarrer l'application

```bash
pnpm dev
```

### 2. Naviguer vers les événements

Ouvrir : http://localhost:3000/dashboard/events

Vous verrez 5 événements :
1. Séminaire Tech 2024 (simple)
2. Convention Innovation 2024 (draft)
3. Roadshow Paris 2024 (terminé)
4. **🏥 Congrès Mondial de Médecine 2024** ← Exemple complexe
5. **💼 TechConnect Summit 2024** ← Exemple complexe

### 3. Explorer le programme

Cliquer sur un événement complexe → onglet "Programme" / "Agenda"

Vous pourrez :
- ✅ Voir les 8 tracks avec leurs couleurs et icônes
- ✅ Filtrer les sessions par track
- ✅ Voir les détails logistiques complets
- ✅ Consulter les prérequis et accès restreints
- ✅ Visualiser les segments d'audience
- ✅ Explorer les 3 journées
- ✅ Voir le timeline avec sessions complexes

### 4. Utiliser comme template

Vous pouvez utiliser ces exemples comme base pour créer vos propres événements :

```typescript
// Copier la structure
import { congressProgramme } from '@/lib/demo-complex-events';

const monCongresDentaire = {
  ...congressProgramme,
  id: 'mon-congres-dentaire-2025',
  titre: 'Congrès Dentaire International 2025',
  // ... personnaliser
};
```

## 📊 Statistiques des exemples

- **2 événements complets**
- **12 tracks thématiques**
- **10 segments d'audience**
- **13+ sessions détaillées**
- **8 contraintes de validation**
- **2 versions avec historique**
- **3 publications ciblées**
- **20+ speakers avec photos**
- Capacités de **50 à 2000 personnes**
- Montage de **0 à 240 minutes**

## 🔧 Fichiers impliqués

```
apps/web/src/
├── lib/
│   ├── demo-complex-events.ts     ← Définition des exemples
│   ├── demo-data.ts                ← Export et intégration
│   └── api.ts                      ← API mock mise à jour
├── app/
│   └── dashboard/
│       └── events/
│           ├── [id]/
│           │   ├── page.tsx        ← Routes statiques
│           │   └── agenda/
│           │       └── page.tsx    ← Routes agenda
│           └── page.tsx            ← Liste des événements
└── types/
    └── agenda.ts                   ← Types complets
```

## 🎓 Cas d'usage pédagogiques

### Pour les développeurs
- Comprendre la structure complète d'un événement
- Voir des exemples de contraintes métier
- Apprendre la modélisation de données complexes

### Pour les product managers
- Comprendre les capacités de la plateforme
- Identifier les fonctionnalités à prioriser
- Visualiser des scénarios d'usage réels

### Pour les commerciaux
- Démonstration client avec données réalistes
- Présentation de cas d'usage variés
- Preuve de concept fonctionnelle

### Pour les organisateurs d'événements
- Templates prêts à l'emploi
- Best practices de configuration
- Exemples de logistique complexe

## 📝 Notes

- Les exemples sont en **mode démo** (pas de vraie base de données)
- Les données sont stockées en mémoire (rechargées au restart)
- Parfait pour la démonstration et le prototypage
- Facilement adaptables pour vos propres besoins

---

**Besoin d'aide ?** Consultez la documentation principale ou ouvrez une issue sur GitHub.
