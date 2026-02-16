# Dictée Markdown - V0

Application web simplifiée pour créer et pratiquer des dictées à l'école primaire.

## 🎯 Objectif V0

Version minimale fonctionnelle sans PWA ni router, centrée sur :

- Bibliothèque locale de dictées (enseignant)
- Mode lecture pour les élèves
- Import/export de dictées au format Markdown
- Migration depuis l'ancienne version micetf.fr/dictee

## 📚 Stack technique

- **React 18** + **Vite 6** : interface et build
- **Tailwind CSS 4** : styles utilitaires
- **localStorage** : stockage local (limite ~50 dictées)
- **Web Speech API** : synthèse vocale (à venir Sprint 5)

## 🚀 Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd dictee-v0

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## 📁 Structure du projet

```
src/
├── domain/           # Modèles de données
│   └── dictee.js    # Modèle dictée + validation
├── services/         # Services métier
│   └── storage.js   # CRUD localStorage
├── components/       # Composants React
│   ├── ModeSelector.jsx      # Choix enseignant/élève
│   ├── TeacherHome.jsx       # Bibliothèque enseignant
│   └── DictationCard.jsx     # Carte dictée
├── utils/            # Utilitaires
│   └── date.js      # Formatage dates
├── App.jsx          # Composant racine + navigation SPA
├── App.css          # Styles globaux
└── index.css        # Config Tailwind + utilitaires
```

## 🎓 Usage

### Mode Enseignant

1. **Créer une dictée** : cliquer sur "Nouvelle dictée"
2. **Modifier** : cliquer sur "Modifier" sur une carte
3. **Supprimer** : cliquer sur "Supprimer" (avec confirmation)
4. **Rechercher** : utiliser la barre de recherche pour filtrer

### Mode Élève

1. Sélectionner une dictée dans la liste
2. Suivre les phrases une par une
3. Saisir le texte dicté
4. Recevoir un feedback immédiat

## 🔄 Fonctionnalités implémentées

### ✅ Sprint 1 (16/02/2026)

- Modèle de données `dictee` avec validation
- Service CRUD localStorage complet
- Documentation initiale

### ✅ Sprint 2 (16/02/2026)

- Navigation SPA sans router
- Sélecteur de mode enseignant/élève
- Styles de base Tailwind + animations
- Structure responsive et accessible

### ✅ Sprint 3 (16/02/2026)

- Bibliothèque enseignant avec liste des dictées
- Composant DictationCard avec actions
- Barre de recherche avec filtrage temps réel
- Tri automatique par date de modification
- Gestion de l'état vide avec CTA

## 🚧 À venir

- **Sprint 4** : Éditeur de dictée (création/modification)
- **Sprint 5** : Lecteur de dictée avec Web Speech API
- **Sprint 6** : Import/export fichiers .md
- **Sprint 7** : Import depuis cloud (CodiMD, Dropbox, Nuage)
- **Sprint 8** : Migration anciens liens micetf.fr/dictee

## 🧪 Tests manuels

Voir les checklists de tests dans les commits de chaque sprint.

Pour créer des dictées de test via la console :

```js
import { saveDictation } from "./src/services/storage.js";
import { createEmptyDictee } from "./src/domain/dictee.js";

const d = createEmptyDictee();
d.title = "Les mois de l'année";
d.language = "fr-FR";
d.sentences = ["Janvier", "Février", "Mars"];
saveDictation(d);
```

## 📖 Documentation

- `README.md` : ce fichier
- `CHANGELOG.md` : historique détaillé des modifications
- `docs/` (à venir) : guides utilisateur et technique

## 🤝 Contribution

Projet développé en solo par sprints incrémentaux.
Chaque sprint = fonctionnalité complète + tests + doc + commit.

## 📝 Licence

À définir

## 👤 Auteur

Conseiller Pédagogique de Circonscription (CPC)  
Mathématiques et Numérique - École primaire française

---

**Version actuelle** : Sprint 3 (Bibliothèque enseignant)  
**Dernière mise à jour** : 16/02/2026
