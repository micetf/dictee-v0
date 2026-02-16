Changelog

Toutes les modifications notables du projet seront documentées ici.

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
