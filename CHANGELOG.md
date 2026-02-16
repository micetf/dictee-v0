Changelog

Toutes les modifications notables du projet seront documentées ici.

## [Sprint 3] - 2026-02-16

### Ajouté

- Composant `TeacherHome` : bibliothèque complète de dictées
- Composant `DictationCard` : carte de dictée avec actions
- Barre de recherche avec filtrage en temps réel
- Utilitaires de formatage de dates (`utils/date.js`)
- Tri automatique des dictées par date de modification
- Messages adaptés pour état vide et recherche sans résultat
- Interface responsive pour actions mobile/desktop

### Amélioré

- Expérience utilisateur enseignant : actions claires et accessibles
- Feedback visuel sur survol et états désactivés

## [Sprint 2] - 2026-02-16

### Ajouté

- Navigation SPA basée sur états React (pas de router)
- Composant `ModeSelector` pour choix enseignant/élève
- Styles CSS de base avec Tailwind et animations
- Structure responsive (mobile-first)
- Placeholders pour vues futures (éditeur, lecteur, bibliothèque)

### Technique

- Classes CSS utilitaires pour gros boutons (élèves primaire)
- Support détection paramètres URL (préparation import cloud)
- Animations fade-in pour transitions douces

## [Sprint 1] - 2026-02-16

### Ajouté

- Modèle de données `dictee` avec validation (`domain/dictee.js`)
- Service CRUD localStorage pour les dictées (`services/storage.js`)
- Documentation initiale README et CHANGELOG
