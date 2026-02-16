# Dictée Markdown - V0

Application web simplifiée pour créer et pratiquer des dictées à l'école primaire.

## Objectif V0

Version minimale fonctionnelle sans PWA ni router, centrée sur :

- Bibliothèque locale de dictées (enseignant)
- Création et modification de dictées avec validation
- Mode lecture pour les élèves (à venir)
- Import/export de dictées (à venir)

## Stack technique

- **React 18** + **Vite 6** : interface et build
- **Tailwind CSS 4** : styles
- **localStorage** : stockage local (limite ~50 dictées)
- **Web Speech API** : synthèse vocale (à venir)

## Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd dictee-v0

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour production
npm run build
```

## Structure du projet

```
src/
├── domain/              # Modèles de données
│   └── dictee.js       # Modèle dictée avec factory
├── services/            # Services métier
│   └── storage.js      # CRUD localStorage
├── components/          # Composants React
│   ├── ModeSelector.jsx      # Choix enseignant/élève
│   ├── TeacherHome.jsx       # Bibliothèque enseignant
│   ├── DictationCard.jsx     # Carte de dictée
│   └── EditorView.jsx        # Éditeur de dictée
├── utils/               # Utilitaires
│   ├── date.js         # Formatage dates
│   └── validation.js   # Validation dictées
├── App.jsx             # Composant racine (navigation SPA)
├── App.css             # Styles application
└── index.css           # Styles globaux + Tailwind
```

## Fonctionnalités actuelles

### Mode Enseignant

- ✅ Sélection du mode (enseignant/élève)
- ✅ Bibliothèque de dictées avec recherche
- ✅ Création de dictées (titre, langue BCP 47, phrases)
- ✅ Modification de dictées existantes
- ✅ Suppression de dictées avec confirmation
- ✅ Validation complète des données
- ✅ Tri par date de modification
- ✅ Compteur de phrases en temps réel
- ✅ Détection des modifications non sauvegardées
- 🔜 Export au format .md (Sprint 6)
- 🔜 Import fichiers .md (Sprint 6)
- 🔜 Import depuis cloud (Sprint 7)
- 🔜 Migration anciens liens (Sprint 8)

### Mode Élève

- ✅ Liste des dictées disponibles
- 🔜 Lecteur avec synthèse vocale (Sprint 5)
- 🔜 Saisie et correction (Sprint 5)

## Utilisation

### Créer une dictée

1. Lancer l'application et choisir "Je suis enseignant"
2. Cliquer sur "Nouvelle dictée"
3. Remplir le formulaire :
    - **Titre** : nom de la dictée (obligatoire, max 100 caractères)
    - **Langue** : code BCP 47 (ex: fr-FR, en-US, es-ES)
    - **Phrases** : une phrase par ligne (min 1, max 100)
4. Cliquer sur "Enregistrer"

### Modifier une dictée

1. Dans la bibliothèque, cliquer sur "Modifier"
2. Effectuer les modifications
3. Cliquer sur "Enregistrer" ou "Annuler"

### Supprimer une dictée

1. Dans la bibliothèque, cliquer sur "Supprimer"
2. Confirmer la suppression

### Codes de langue courants

- **fr-FR** : Français (France)
- **en-US** : Anglais (États-Unis)
- **en-GB** : Anglais (Royaume-Uni)
- **es-ES** : Espagnol (Espagne)
- **de-DE** : Allemand (Allemagne)
- **it-IT** : Italien (Italie)

### Mode Élève

- ✅ Liste des dictées disponibles (bibliothèque locale)
- ✅ Lecteur de dictée avec :
    - Lecture phrase par phrase
    - Synthèse vocale (navigateur compatible)
    - Saisie de la phrase par l'élève
    - Correction simple (exact / différent)
    - Navigation entre phrases
    - Option d'affichage de la phrase (soutien)

## Limitations connues

- Stockage localStorage limité (~5-10 Mo selon navigateurs)
- Environ 50 dictées maximum recommandées
- Pas de synchronisation multi-appareils (stockage local uniquement)
- Pas de mode hors-ligne (PWA désactivée pour V0)

## Développement

### Sprints réalisés

- **Sprint 1** : Modèle de données et stockage localStorage
- **Sprint 2** : Navigation SPA et sélection du mode
- **Sprint 3** : Bibliothèque enseignant avec CRUD
- **Sprint 4** : Éditeur de dictée avec validation
- **Sprint 5** : Lecteur de dictée avec synthèse vocale

### À venir

- **Sprint 6** : Import/export fichiers Markdown
- **Sprint 7** : Import depuis cloud (CodiMD, Dropbox, etc.)
- **Sprint 8** : Migration anciens liens micetf.fr/dictee

## Contribution

Ce projet est développé de manière incrémentale par sprints.
Chaque sprint est documenté dans le CHANGELOG.md.

## Licence

MIT

## Contact

Projet micetf.fr - École primaire française
