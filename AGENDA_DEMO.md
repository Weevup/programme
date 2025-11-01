# 📅 Démo complète de l'Agenda

## 🎯 Accès local

Serveur dev : **http://localhost:3000**

### Navigation vers l'agenda

1. **Page d'accueil** : http://localhost:3000/dashboard/events
   - Tu vois 5 événements

2. **Congrès Médical** : http://localhost:3000/dashboard/events/event-congress-2024
   - Clique sur l'onglet "Sessions" ou le bouton "Voir l'agenda complet"

3. **Agenda complet** : http://localhost:3000/dashboard/events/event-congress-2024/agenda
   - C'est ici que tu vois TOUT le programme détaillé

---

## 📊 Ce que tu vois dans l'agenda

### En-tête - Statistiques
```
📌 Total Sessions: 120
👥 Plénières: 25
🎓 Ateliers: 68
☕ Pauses: 18
👨‍🏫 Intervenants: 45
```

### 4 Vues disponibles

#### 1️⃣ **Vue Timeline** (Calendrier)
- Timeline horaire de 08:00 à 20:00
- Sessions organisées par salle
- Navigation par jour (←  Jour 1 - 15/10/2024  →)
- Filtrage par track (8 boutons colorés)
- Chaque session affiche :
  - Heure de début et fin
  - Titre
  - Type (badge coloré)
  - Track (bordure colorée + icône)
  - Salle

#### 2️⃣ **Vue Liste** (Détaillée)
- Sessions listées chronologiquement
- Navigation par jour (←  Jour 1  →)
- Filtres :
  - **Parcours** : Tous | ❤️ Cardiologie | 🎗️ Oncologie | 🧠 Neurologie | etc.
  - **Type** : Tous | Plénière | Atelier | Pause | etc.

**Chaque session affiche** :
```
┌─────────────────────────────────────────────────────────┐
│ 🏥 [Cardiologie]                    [Badge: Plénière]   │
│                                                          │
│ Nouvelles approches en insuffisance cardiaque           │
│ État de l'art sur les traitements...                    │
│                                                          │
│ ⏰ 09:45 - 11:15 (1h30)                                 │
│ 📍 Amphithéâtre Pasteur                                 │
│    Palais des Congrès Paris                             │
│ 👥 987 / 1200 participants                              │
│                                                          │
│ 👨‍⚕️ Intervenants:                                        │
│ [Photo] Dr. Sarah Mitchell                              │
│         Cardiologue • Mayo Clinic                       │
│ [Photo] Prof. Marco Rossi                               │
│         Chef de Service • San Raffaele                  │
└─────────────────────────────────────────────────────────┘
```

#### 3️⃣ **Vue Grille** (Cartes visuelles)
- Layout 3 colonnes (responsive)
- Même système de filtres
- Cartes compactes avec infos essentielles

**Chaque carte affiche** :
```
┌──────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← Bordure colorée track
│ [🏥 Cardiologie]    [Plénière]  │
│                                  │
│ Nouvelles approches en...        │
│ État de l'art sur les...         │
│                                  │
│ ⏰ 09:45 - 11:15 (1h30)         │
│ 📍 Amphithéâtre Pasteur         │
│ 👥 987 / 1200                   │
│                                  │
│ [👤][👤] 2 intervenants          │
└──────────────────────────────────┘
```

#### 4️⃣ **Vue Conflits**
- Détection automatique des conflits :
  - Chevauchement de sessions dans une même salle
  - Même intervenant à 2 endroits en même temps
  - Capacité dépassée
- Liste des conflits avec bouton "Résoudre"

---

## 📋 Données complètes disponibles

### Exemple session complète (cong-s002)

```json
{
  "id": "cong-s002",
  "eventId": "event-congress-2024",
  "programmeId": "programme-congress-2024",
  "journeeId": "congress-j1",
  "trackId": "track-cardio",

  "title": "Nouvelles approches en insuffisance cardiaque",
  "description": "État de l'art sur les traitements de l'insuffisance cardiaque chronique et aiguë",
  "type": "PLENARY",

  "startTime": "2024-10-15T09:45:00",
  "endTime": "2024-10-15T11:15:00",

  "venueRoomId": "congress-amphiA",
  "maxCapacity": 1200,
  "currentRegistrations": 987,

  "isPublic": true,
  "language": "en",
  "segmentsAutorises": ["seg-medecin", "seg-chercheur", "seg-vip"],

  "tags": ["cardiologie", "insuffisance cardiaque", "recherche"],

  "speakers": [
    {
      "id": "spk-002",
      "name": "Dr. Sarah Mitchell",
      "title": "Cardiologue",
      "company": "Mayo Clinic, USA",
      "bio": "Spécialiste mondiale de l'insuffisance cardiaque",
      "photo": "https://i.pravatar.cc/150?img=45",
      "email": "s.mitchell@mayo.edu",
      "order": 0
    },
    {
      "id": "spk-003",
      "name": "Prof. Marco Rossi",
      "title": "Chef de Service",
      "company": "Ospedale San Raffaele, Milano",
      "bio": "Expert en transplantation cardiaque",
      "photo": "https://i.pravatar.cc/150?img=12",
      "email": "m.rossi@sanraffaele.it",
      "order": 1
    }
  ],

  "interactions": {
    "qaActive": true,
    "quizActive": false,
    "sondageActive": true,
    "wordcloudActive": false
  },

  "logistique": {
    "ressources": ["2 micros HF", "Écran 4K", "Pointeur laser", "Clicker présentation"],
    "tempsMontage": 30,
    "tempsDemonte": 15,
    "instructions": "Traduction simultanée EN→FR requise. Prévoir clickers pour sondages interactifs."
  }
}
```

---

## 🎨 Tracks (Parcours thématiques)

### Congrès Médical - 8 tracks

| Icône | Nom | Couleur | Sessions |
|-------|-----|---------|----------|
| ❤️ | Cardiologie | #DC2626 (Rouge) | ~15 sessions |
| 🎗️ | Oncologie | #7C3AED (Violet) | ~15 sessions |
| 🧠 | Neurologie | #2563EB (Bleu) | ~15 sessions |
| 👶 | Pédiatrie | #F59E0B (Orange) | ~15 sessions |
| 📸 | Imagerie Médicale | #06B6D4 (Cyan) | ~15 sessions |
| 🤖 | IA & Santé Numérique | #8B5CF6 (Violet clair) | ~15 sessions |
| 🔬 | Chirurgie | #10B981 (Vert) | ~15 sessions |
| 🌍 | Santé Publique | #EC4899 (Rose) | ~15 sessions |

### TechConnect Summit - 4 tracks

| Icône | Nom | Couleur | Sessions |
|-------|-----|---------|----------|
| ☁️ | SaaS & Cloud | #3B82F6 (Bleu) | ~12 sessions |
| 💰 | FinTech | #10B981 (Vert) | ~11 sessions |
| 🔒 | Cybersécurité | #EF4444 (Rouge) | ~11 sessions |
| 🤖 | IA & Data | #8B5CF6 (Violet) | ~11 sessions |

---

## 📅 Journées

### Congrès Médical

**Jour 1 - 15 octobre 2024**
- Ouverture : 08:00
- Fermeture : 20:00
- Thème : Innovation & Recherche
- ~40 sessions

**Jour 2 - 16 octobre 2024**
- Ouverture : 08:00
- Fermeture : 19:30
- Thème : Pratiques Cliniques
- ~40 sessions

**Jour 3 - 17 octobre 2024**
- Ouverture : 08:30
- Fermeture : 17:00
- Thème : Futur de la Médecine
- ~40 sessions

---

## 🔍 Filtres disponibles

### Dans toutes les vues

1. **Navigation de date**
   - Boutons ← Précédent / Suivant →
   - Affichage de la date actuelle
   - Compteur de sessions du jour

2. **Filtres de tracks**
   - Bouton "Tous" pour réinitialiser
   - Un bouton par track avec :
     - Icône du track
     - Nom du track
     - Couleur du track
   - Sélection multiple possible

3. **Filtres de type** (Liste et Grille uniquement)
   - Tous
   - Plénière
   - Atelier
   - Pause
   - Repas
   - Networking
   - Autre

---

## ⚙️ Fonctionnalités interactives

### Clic sur une session
- Ouvre un dialog avec toutes les informations
- Permet d'éditer la session
- Affiche les conflits potentiels
- Accès aux interactions (Q&A, sondages)

### Export de programme
- **CSV** : Tableur Excel
- **Markdown** : Documentation
- **JSON** : Format technique

### Détection de conflits
- Automatique en temps réel
- Badge rouge avec nombre de conflits
- Panel dédié pour résolution

---

## 🎯 Test en local

### Étapes pour tester

1. **Démarre le serveur** (déjà fait ✅)
   ```bash
   pnpm dev
   ```

2. **Ouvre ton navigateur**
   - URL : http://localhost:3000

3. **Va sur les événements**
   - Clique sur "Dashboard" dans le menu
   - Clique sur "Événements"

4. **Choisis un événement**
   - "Congrès Mondial de Médecine 2024" (120 sessions)
   - ou "TechConnect Summit 2024" (45 sessions)

5. **Accède à l'agenda**
   - Clique sur "Voir l'agenda complet"
   - ou va sur l'onglet "Sessions"

6. **Explore les vues**
   - Clique sur les onglets : Timeline, Liste, Grille
   - Utilise les filtres de tracks
   - Navigue entre les jours
   - Clique sur une session pour voir les détails

---

## 📊 Résumé des données

### Congrès Médical 2024
- **120 sessions** détaillées
- **8 tracks** thématiques
- **3 jours** de programme
- **45 intervenants** avec photos
- **6 segments** d'audience
- **8 salles** différentes
- **3200 participants**
- **Multilingue** (FR, EN, ES, DE)

### TechConnect Summit 2024
- **45 sessions** détaillées
- **4 tracks** thématiques
- **3 jours** de programme
- **28 intervenants**
- **4 segments** professionnels
- **6 salles**
- **1500 participants**
- **Bilingue** (FR, EN)

---

## ✅ Toutes les informations sont là !

Chaque session contient :
- ✅ Date et heure exacte
- ✅ Durée calculée
- ✅ Titre et description
- ✅ Type de session
- ✅ Salle et venue
- ✅ Track thématique
- ✅ Capacité et inscriptions
- ✅ Liste des intervenants avec photos et coordonnées
- ✅ Tags
- ✅ Langue
- ✅ Interactions disponibles (Q&A, sondages...)
- ✅ Logistique (montage, ressources, instructions)
- ✅ Segments d'audience autorisés
- ✅ Prérequis éventuels
- ✅ Accès premium ou non

**L'agenda est complet et fonctionnel !** 🎉
