# Changelog

Toutes les modifications notables du projet seront documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [Sprint 14] - 2026-02-18

### Navbar MiCetF et cartes de dictées

#### Ajouté

- **Barre de navigation MiCetF**

    - Composant `Navbar.jsx` aligné visuellement sur micetf.fr
    - Lien `MiCetF` vers la page d’accueil du site
    - Titre de l’outil : « Je crée mes dictées – Markdown »
    - Bouton PayPal (don) avec icône cœur
    - Bouton de contact (mail webmaster)

- **Vue élève en cartes**

    - Affichage des dictées locales en cartes responsives (grille 1–2 colonnes)
    - Chaque carte affiche le titre, le nombre de phrases et la langue
    - Grande zone cliquable pour démarrer la dictée

- **Vue enseignant en cartes (bibliothèque)**
    - Bibliothèque enseignant organisée en grille de cartes (`DictationCard`)
    - Mise en page plus lisible sur écran large, tout en restant adaptée au mobile

#### Modifié

- **App.jsx**

    - Intégration globale de la barre de navigation en haut de l’application
    - Vue élève : remplacement de la liste simple par une grille de cartes

- **TeacherHome.jsx**
    - Affichage des dictées en grille (2 colonnes sur desktop) au lieu d’une liste verticale

#### Pédagogique / Terrain

- Interface plus lisible et rassurante pour les élèves en situation de test sur PC
- Cohérence graphique avec les autres outils micetf.fr (repères visuels conservés)
- Meilleure vue d’ensemble de la bibliothèque pour l’enseignant, facilitant le choix de dictée

## [Sprint 13] - 2026-02-18

### Ponctuation et majuscules selon le type de dictée

#### Ajouté

- **Type de dictée dans le modèle**

    - Champ `type` ajouté au modèle de dictée (`sentences` ou `words`)
    - `createEmptyDictee()` initialise `type: "sentences"`
    - Normalisation du `type` lors du chargement/sauvegarde dans `storage.js`

- **Support du type dans le format Markdown**

    - Nouvelle métadonnée `type` dans le front matter YAML (`words` ou `sentences`)
    - `parseMarkdown()` lit et normalise `type` (fallback `sentences` si absent/incorrect)
    - `generateMarkdown()` écrit systématiquement le `type` dans le front matter

- **Correction différenciée mots / phrases**

    - Fonction `isAnswerCorrect(answer, expected, type)` dans `utils/textComparison.js`
    - Mode `words` : casse ignorée, ponctuation de bord ignorée (ex : `Paris,` ≡ `paris`)
    - Mode `sentences` : casse et ponctuation significatives, espaces normalisés uniquement

- **Choix du type dans l’éditeur**
    - Nouveau bloc dans `EditorView` : radio-buttons “Dictée de phrases” / “Dictée de mots”
    - Aide sous le champ pour orienter l’enseignant (listes de mots invariables, sons, etc.)
    - Persistance du type lors de l’édition et de la duplication

#### Modifié

- **PlayerView**

    - Remplacement de `areTextsEqual()` par `isAnswerCorrect()` pour la validation des réponses
    - Comportement :
        - Dictée de phrases : oubli de majuscule ou de point final = erreur
        - Dictée de mots : majuscules et ponctuation non pénalisantes

- **storage.js**
    - Normalisation des dictées existantes au chargement (`type` manquant → `sentences`)
    - Mise à jour des dictées par défaut avec un `type` explicite

#### Pédagogique / Terrain

- Alignement avec la distinction **orthographe lexicale** (dictées de mots) vs **orthographe grammaticale / ponctuation** (dictées de phrases)
- Permet d’éviter de sanctionner la ponctuation en dictée de mots tout en l’évaluant en dictée de phrases
- Contrat de tâche plus lisible pour les élèves et les enseignants

## [Sprint 12] - 2026-02-18

### Partage de dictées (liens encodés et cloud)

#### Ajouté

- **Partage encodé des dictées**
    - Génération de liens courts contenant la dictée encodée (base64 URL-safe)
    - Décodage automatique via le paramètre `?share=...` dans l’URL
    - Ouverture directe en mode élève sans passer par la bibliothèque
- **Partage via services cloud**
    - Import direct de dictées stockées sur des services externes (CodiMD / HedgeDoc, Dropbox, Google Drive)
    - Analyse et normalisation automatique des URLs de téléchargement
    - Import cloud à partir de l’éditeur et de la bibliothèque enseignant
- **Hook `useUrlParams`**
    - Détection au chargement de l’application des paramètres `?share` et `?cloud`
    - Gestion des états `idle`, `loading`, `ready`, `error` avec messages explicites
    - Redirection automatique vers le lecteur élève pour une dictée partagée

#### Modifié

- **PlayerView**
    - Prise en charge d’une dictée “partagée” sans enregistrement local
    - Affichage du titre et de la langue provenant du lien de partage ou du cloud
- **TeacherHome / DictationCard**
    - Boutons de partage pour chaque dictée (lien encodé, lien cloud)
    - Indications claires pour copier et transmettre les liens aux élèves

#### Technique

- Service `shareService.js` pour l’encodage/décodage des dictées
- Service `cloudImport.js` pour la récupération de fichiers Markdown distants
- Validation du contenu Markdown importé avant ouverture dans le lecteur
- Gestion robuste des erreurs réseau et de format (messages adaptés aux enseignants)

#### Pédagogique / Terrain

- L’enseignant peut partager une dictée en un lien simple envoyé par ENT, mail ou QR code
- Les élèves accèdent directement à la dictée sans manipulation technique
- Compatible avec les pratiques existantes sur micetf.fr (CodiMD / HedgeDoc comme stockage)

## [Sprint 11] - 2026-02-16

### Dictées par défaut - Application prête à l'emploi

#### Ajouté

- **8 dictées préchargées au premier lancement**
    - Mots invariables CP-1 (12 mots)
    - Mots invariables CP-2 (12 mots)
    - Mots invariables CE1-1 (12 mots)
    - Mots invariables CE1-2 (12 mots)
    - Mots invariables CE1-3 (12 mots)
    - Mots invariables CE1-4 (12 mots)
    - Les mois de l'année (français, 12 mois)
    - The months of the year (anglais, 12 mois)
- **Fichier de données par défaut**
    - `src/data/defaultDictations.js`
    - Structure standardisée : title, language, sentences
    - 96 mots au total (72 mots invariables + 24 mois)
- **Fonction resetToDefaultDictations()**
    - Réinitialisation complète de la bibliothèque
    - Confirmation obligatoire (double sécurité)
    - Accessible depuis storage.js

#### Modifié

- **storage.js - Fonction listDictations()**
    - Détection automatique du premier lancement (`!stored`)
    - Appel transparente loadDefaultDictations()
    - Relecture après chargement pour synchronisation
- **storage.js - Ajout loadDefaultDictations()**
    - Génération IDs uniques avec uuid
    - Timestamps incrémentés pour ordre stable
    - Gestion d'erreur avec logs console
    - Sauvegarde directe dans localStorage

#### Technique

- Détection premier lancement : `localStorage.getItem(STORAGE_KEY) === null`
- IDs générés avec `uuidv4()` pour garantir unicité
- Timestamps `now + index` pour tri chronologique stable
- Import ES6 depuis `src/data/defaultDictations.js`
- Pas de dépendance externe (données statiques JS)

#### Pédagogique / Terrain

- Application immédiatement utilisable sans configuration
- Contenu adapté cycles 2-3 (CP/CE1)
- Progression mots invariables conforme programmes
- Dictées multilingues (français + anglais) pour éveil langues
- Enseignant peut modifier/dupliquer/supprimer ces dictées
- Base solide pour créer ses propres dictées

#### Tests manuels validés

- [x] Premier lancement : 8 dictées chargées automatiquement
- [x] Console affiche "✅ 8 dictées par défaut chargées"
- [x] Dictées modifiables/supprimables comme les autres
- [x] Fonction resetToDefaultDictations() avec confirmation
- [x] IDs uniques générés correctement
- [x] Ordre stable dans la bibliothèque
- [x] Pas de doublon au rechargement
- [x] Mode élève : toutes les dictées jouables

## [Sprint 10] - 2026-02-16

### Sélection de langue adaptative et diagnostic des voix

#### Ajouté

- **Hook useAvailableVoices**
    - Détection dynamique des voix de synthèse disponibles
    - Compatible tous navigateurs (Chrome, Firefox, Safari, Edge)
    - Gestion de l'événement onvoiceschanged
    - Fonctions getVoicesForLanguage() et isLanguageAvailable()
- **Configuration centralisée des langues**
    - `src/utils/languages.js`
    - 5 langues supportées : Français 🇫🇷, Anglais 🇬🇧, Espagnol 🇪🇸, Allemand 🇩🇪, Italien 🇮🇹
    - Code BCP 47 standard (fr-FR, en-US, etc.)
    - Constante DEFAULT_LANGUAGE
- **Composant LanguageSelector**
    - Menu déroulant avec drapeaux et labels
    - Détection automatique des langues disponibles sur le système
    - Langues indisponibles marquées "(non disponible)" et désactivées
    - Message d'alerte si aucune voix détectée
    - Détail déroulable des langues avec statut (✓/✗)
- **Page VoicesDebugView (diagnostic enseignant)**
    - Liste complète des voix détectées sur le navigateur
    - Compatibilité avec les langues de l'app (vert/rouge)
    - Tableau détaillé : langue, nom de la voix, local/cloud
    - Accessible depuis TeacherHome via bouton "Langues disponibles"
    - Messages d'aide contextuels
- **Intégration dans EditorView**
    - Remplacement du champ texte langue par LanguageSelector
    - Sélection visuelle intuitive avec drapeaux
    - Langue par défaut : fr-FR
- **Navigation vers diagnostic**
    - Bouton "Langues disponibles" dans TeacherHome
    - Route "voices-debug" dans App.jsx
    - Retour vers bibliothèque enseignant

#### Modifié

- **EditorView**
    - Import DEFAULT_LANGUAGE pour initialisation
    - Fonction handleLanguageChange adaptée (lang au lieu de e.target.value)
    - Interface utilisateur modernisée avec drapeaux
- **TeacherHome**
    - Ajout bouton "Langues disponibles" avec icône info
    - Responsive : texte complet desktop, "Langues" mobile
    - Prop onNavigate pour navigation vers diagnostic
- **App.jsx**
    - Import VoicesDebugView
    - Fonction handleNavigate pour navigation page diagnostic
    - Route voices-debug avant fallback
    - Condition view !== "voices-debug" dans fallback

#### Technique

- Hook personnalisé avec cleanup (onvoiceschanged)
- Détection voix asynchrone (nécessaire sur certains navigateurs)
- Filtrage voix par code langue exact + partiel (fr-FR, fr-CA, etc.)
- Gestion état loading pendant détection
- Utilitaires getLanguageByCode, getLanguageLabel

#### Pédagogique / Terrain

- Enseignant peut vérifier avant test en classe quelles langues fonctionnent
- Évite de créer des dictées dans une langue non disponible
- Alerte claire si langue manquante
- Facilite le dépannage (Chrome recommandé si problème)

#### Tests manuels validés

- [x] Page VoicesDebugView affiche toutes les voix
- [x] LanguageSelector affiche menu déroulant avec drapeaux
- [x] Langues disponibles/indisponibles détectées correctement
- [x] Détail déroulant fonctionne
- [x] Bouton "Langues disponibles" dans TeacherHome
- [x] Navigation vers diagnostic et retour
- [x] Édition dictée : langue sélectionnable
- [x] Création dictée : langue par défaut fr-FR

## [Sprint 9] - 2026-02-16

### Refonte complète PlayerView - Système d'étoiles et impression

#### Ajouté

- **Système de mastéry learning avec validation obligatoire**
    - Validation phrase par phrase (plus mot par mot)
    - Obligation de réussir avant de passer à la phrase suivante
    - Maximum 3 tentatives puis option "Passer"
- **Système d'évaluation à 3 étoiles**
    - ⭐⭐⭐ : Phrase juste du premier coup
    - ⭐⭐ : Phrase juste en 2-3 essais
    - ⭐ : Phrase juste après 3+ essais
    - (vide) : Phrase passée sans validation
- **Comparaison erreur/correction côte à côte (Option A)**
    - Affichage "❌ Ta réponse" vs "✅ Attendu"
    - Messages d'encouragement contextuels (3 niveaux selon nombre d'essais)
    - Bouton "Réessayer" pour nouvelle tentative
- **Composant ResultsView complet**
    - Affichage score total et pourcentage
    - Répartition visuelle par type d'étoiles (4 cartes)
    - Détail complet de toutes les phrases
    - Historique des tentatives par phrase
- **Système d'impression/export PDF natif**
    - Impression via window.print() (pas de dépendance externe)
    - Modal de personnalisation (nom élève, classe, enseignant)
    - Option afficher/masquer les tentatives
    - Mise en page optimisée A4 ultra-compacte
    - En-tête, légende, zones de signature, pied de page
    - CSS @media print dédié
    - Les étoiles ⭐ s'affichent parfaitement
    - Bouton impression rapide (sans options)
- **Utilitaires de comparaison de texte**
    - `src/utils/textComparison.js`
    - Normalisation insensible casse/espaces
    - Fonction `areTextsEqual()` pour validation
    - Fonction `compareWords()` (prête pour usage futur)

#### Modifié

- **PlayerView : refonte totale du workflow**
    - Gestion états complexes (tentatives, résultats, validation)
    - Calcul dynamique des étoiles selon règles métier
    - Textarea désactivée après réussite
    - Boutons conditionnels selon état
    - Passage automatique impossible sans validation
- **Optimisation de l'espace pour impression**
    - Marges réduites à 10mm
    - Polices compactes (9pt body, 8pt détails)
    - Espacements minimisés
    - Layout sur 1 ligne pour en-tête et score
    - Dictée 15-20 phrases : 1 page A4

#### Supprimé

- Dépendance jsPDF (non fonctionnelle avec étoiles Unicode)
- Tentative pdfmake (problèmes d'import)
- Bouton "Afficher la phrase" (non pertinent didactiquement)

#### Technique

- Correction warning React (setState synchrone dans useEffect)
- Utilisation `queueMicrotask()` pour différer les setState
- Suppression imports inutilisés (`compareWords`)
- CSS print avec classes utilitaires (.no-print, .print-keep-together)
- Modal contrôlé par état local (showPrintOptions)

#### Didactique

- Validation obligatoire = garantie de passage par la réussite
- Feedback immédiat avec correction explicite
- Différenciation naturelle (rythme individuel)
- Porte de sortie après 3 échecs (évite frustration)
- Score motivant mais non stigmatisant

#### Tests manuels validés

- [x] Workflow phrase juste 1er coup → ⭐⭐⭐
- [x] Workflow avec erreurs puis réussite → ⭐⭐ ou ⭐
- [x] Option "Passer" après 3 échecs
- [x] Écran résultats avec répartition correcte
- [x] Impression avec personnalisation
- [x] Impression rapide sans modal
- [x] Étoiles affichées dans le PDF
- [x] Mise en page compacte 1 page pour 15 phrases

## [Sprint 8] - 2026-02-16

### Ajouté

- Service de migration legacy (`services/legacyImport.js`) :
    - Décodage des phrases encodées en codes ASCII (format d[1]=66|111|...)
    - Normalisation des codes langue legacy vers BCP 47
    - Décodage des titres URL-encodés
    - Validation du format URL legacy
    - Détection automatique d'URL legacy
- Composant `MigrateLegacyModal` :
    - Saisie et analyse d'URL legacy
    - Aperçu des phrases décodées avant import
    - Messages d'erreur contextuels avec format attendu
    - Aide intégrée pour retrouver les anciennes dictées
    - Support Ctrl+Entrée pour lancer l'analyse

### Technique

- Parser de query string avec URLSearchParams
- Décodage String.fromCharCode pour codes ASCII
- Mapping codes langue legacy → BCP 47
- Limite de sécurité 100 phrases par URL

### Documentation

- Guide de migration dans README
- Exemples d'URLs legacy dans la modal

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
