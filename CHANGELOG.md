# Changelog

Toutes les modifications notables du projet seront documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [Sprint 7] - 2026-02-16

### Ajouté

- Service d'import cloud (`services/cloudImport.js`) :
    - Support CodiMD / HedgeDoc (détection auto + normalisation URL)
    - Support Dropbox (conversion lien partage → téléchargement direct)
    - Support Google Drive (extraction ID fichier)
    - Détection automatique du service cloud
    - Gestion des erreurs CORS avec messages explicites
- Composant `ImportCloudModal` :
    - Saisie URL avec détection service
    - Récupération asynchrone du contenu
    - Aperçu avant import
    - États de chargement et messages d'erreur contextuels
    - Aide déroulante pour chaque service

### Technique

- Fetch avec gestion CORS
- Normalisation automatique des URLs selon le service
- Validation du contenu récupéré avant import
- Support de la touche Entrée pour lancer le fetch

## [Sprint 6] - 2026-02-16

### Ajouté

- Service Markdown (`services/markdown.js`) :
    - Parsing de fichiers .md avec front matter YAML
    - Génération de Markdown depuis une dictée
    - Validation de format
- Composant `ImportMarkdownModal` :
    - Sélection de fichier avec aperçu
    - Validation et messages d'erreur
    - Import dans la bibliothèque locale
- Utilitaires de téléchargement (`utils/download.js`) :
    - Téléchargement de fichiers texte côté client
    - Nettoyage de noms de fichiers
- Documentation du format Markdown (`docs/FORMAT_MARKDOWN.md`)
- Boutons d'export :
    - Export individuel par dictée
    - Export groupé (toutes les dictées)

### Technique

- Format compatible avec l'ancien projet micetf.fr/dictee-markdown
- Encodage UTF-8 pour support multilingue
- Round-trip garanti (export → import → données identiques)

## [Sprint 5] - 2026-02-16

### Ajouté

- Composant `PlayerView` pour le mode élève :
    - Lecture phrase par phrase
    - Synthèse vocale via Web Speech API
    - Saisie de la phrase et feedback simple (correct/incorrect)
    - Navigation précédente / suivante
    - Écran de fin de dictée avec options (recommencer, retour)
    - Option d'affichage de la phrase (soutien à la compréhension)
- Hook `useSpeechSynthesis` :
    - Détection du support navigateur
    - Gestion des états speaking / error
    - API simple `speak(text, lang)` et `cancel()`

### Technique

- Préparation au remplacement du hook de synthèse par le code plus avancé existant
- Normalisation de texte pour comparaison insensible à la casse et aux espaces

## [Sprint 4] - 2026-02-16

### Ajouté

- Composant `EditorView` : création et modification de dictées
- Validation complète des données (`utils/validation.js`)
    - Titre (obligatoire, max 100 caractères)
    - Langue au format BCP 47 (ex: fr-FR, en-US)
    - Phrases (min 1, max 100, max 500 caractères/phrase)
- Compteur de phrases en temps réel
- Détection des modifications non sauvegardées
- Confirmation avant annulation si changements
- Aide contextuelle pour codes de langue (détails dépliable)
- État de sauvegarde avec spinner
- Messages d'erreur contextuels par champ
- Initialisation paresseuse des états pour éviter rendus en cascade

### Corrigé

- Warning React "cascading renders" dans EditorView (initialisation paresseuse)
- Warning React "cascading renders" dans TeacherHome (initialisation paresseuse + key dynamique)
- Ordre de déclaration des fonctions (erreur ESLint immutability)

### Amélioré

- Expérience utilisateur : feedback immédiat sur validation
- Interface accessible : labels, focus, erreurs explicites
- Performance : élimination des rendus inutiles
- Conformité React 19 best practices

## [Sprint 3] - 2026-02-16

### Ajouté

- Composant `TeacherHome` : bibliothèque complète de dictées
- Composant `DictationCard` : carte de dictée avec actions
- Barre de recherche avec filtrage en temps réel
- Utilitaires de formatage de dates (`utils/date.js`)
    - Format court (JJ/MM/AAAA)
    - Format complet (JJ/MM/AAAA HH:MM)
    - Format relatif (aujourd'hui, hier, il y a X jours)
- Tri automatique des dictées par date de modification (décroissante)
- Messages adaptés pour état vide et recherche sans résultat
- Interface responsive pour actions mobile/desktop
- Boutons d'import (désactivés, placeholders pour sprints futurs)

### Amélioré

- Expérience utilisateur enseignant : actions claires et accessibles
- Feedback visuel sur survol et états désactivés
- Navigation intuitive entre bibliothèque et éditeur

## [Sprint 2] - 2026-02-16

### Ajouté

- Navigation SPA basée sur états React (sans router)
- Composant `ModeSelector` pour choix enseignant/élève
- Styles CSS de base avec Tailwind et animations
- Structure responsive (mobile-first)
- Placeholders pour vues futures (éditeur, lecteur, bibliothèque)
- Classes CSS utilitaires pour gros boutons (élèves primaire)
- Support détection paramètres URL (préparation import cloud)
- Animations fade-in pour transitions douces
- Accessibilité : navigation clavier, ARIA labels, focus visible

### Technique

- Gestion d'état centralisée dans App.jsx (mode, view, currentDictationId)
- Callbacks pour navigation entre vues
- Styles globaux avec variables CSS

## [Sprint 1] - 2026-02-16

### Ajouté

- Modèle de données `dictee` avec validation (`domain/dictee.js`)
    - Structure : id, title, language, sentences, createdAt, updatedAt
    - Factory `createEmptyDictee()` avec UUID et timestamps
    - Fonction de validation `isValidDictee()`
- Service CRUD localStorage pour les dictées (`services/storage.js`)
    - `listDictations()` : lister toutes les dictées
    - `getDictation(id)` : récupérer une dictée par ID
    - `saveDictation(dictation)` : créer ou mettre à jour
    - `deleteDictation(id)` : supprimer une dictée
    - `countDictations()` : compter les dictées
    - `clearAllDictations()` : vider le stockage (debug)
- Gestion des erreurs localStorage (quota dépassé)
- Documentation initiale (README, CHANGELOG)

### Technique

- Clé de stockage : `dictee-markdown-v0:dictations`
- Format JSON sérialisé dans localStorage
- Limite assumée : ~50 dictées (5-10 Mo selon navigateurs)

---

## Conventions

### Types de modifications

- **Ajouté** : nouvelles fonctionnalités
- **Modifié** : changements de fonctionnalités existantes
- **Déprécié** : fonctionnalités bientôt supprimées
- **Supprimé** : fonctionnalités retirées
- **Corrigé** : corrections de bugs
- **Sécurité** : corrections de vulnérabilités

### Format des messages de commit

```
type(scope): description courte

- Détail 1
- Détail 2

Sprint X : résumé
```

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
