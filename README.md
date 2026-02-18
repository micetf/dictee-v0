# Dictée - V1

Application web pour créer et pratiquer des dictées à l'école primaire (cycles 1 à 3).

**Version 0.10** - Février 2026

---

## 🎯 Objectif V0

Application minimale fonctionnelle centrée sur l'essentiel :

- ✅ Bibliothèque locale de dictées (enseignant)
- ✅ Création/modification avec sélection langue adaptative
- ✅ Lecteur élève avec système d'étoiles et feedback immédiat
- ✅ Import/export Markdown et cloud
- ✅ Migration anciennes dictées
- ✅ Impression résultats personnalisable

---

## 🚀 Installation

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

---

---

## 📚 Dictées par défaut

L'application contient **8 dictées préchargées** au premier lancement :

**Cycle 2 (CP/CE1) - Mots invariables :**

- **Mots invariables CP-1** : après, assez, avec, beaucoup, bien, chez, dans, jamais, mais, moins, non, oui
- **Mots invariables CP-2** : quand, qui, parce que, partout, pas, plus, pour, sur, toujours, tout, très, trop
- **Mots invariables CE1-1** : alors, après, assez, aujourd'hui, aussi, autant, autour, autrefois, avant, avec, beaucoup, bien
- **Mots invariables CE1-2** : chez, combien, comme, comment, dans, déjà, depuis, demain, derrière, dessous, dessus, devant
- **Mots invariables CE1-3** : encore, ensuite, hier, jamais, longtemps, maintenant, mais, mieux, moins, parce que, parfois, pendant
- **Mots invariables CE1-4** : plusieurs, pourquoi, quand, quelquefois, sans, seulement, soudain, souvent, toujours, très, trop, voilà

**Vocabulaire de base :**

- **Les mois de l'année** (français) : janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre
- **The months of the year** (anglais) : January, February, March, April, May, June, July, August, September, October, November, December

> **📌 Note :** Ces dictées sont chargées automatiquement lors de la première utilisation. Elles peuvent être modifiées, dupliquées ou supprimées comme n'importe quelle dictée créée.

**Contenu pédagogique :**

- **96 mots** au total (72 mots invariables + 24 mois)
- Progression conforme aux programmes de **cycle 2**
- Mots invariables essentiels pour l'orthographe grammaticale
- Vocabulaire de base transdisciplinaire (repérage temporel)
- Dictée anglaise pour ouverture aux langues

**Réinitialisation :**  
Si vous souhaitez revenir aux 8 dictées par défaut après avoir créé/importé d'autres dictées, utilisez la fonction `resetToDefaultDictations()` dans la console développeur (⚠️ supprime toutes les dictées existantes).

## 🛠️ Stack technique

- **React 18** + **Vite 6** : Interface et build rapide
- **Tailwind CSS 4** : Styles utilitaires
- **localStorage** : Stockage local persistant
- **Web Speech API** : Synthèse vocale multilingue
- **Aucune dépendance externe** pour le PDF (impression native)

---

## 📁 Structure du projet

```
src/
├── domain/                    # Modèles de données
│   └── dictee.js             # Modèle dictée avec factory
├── services/                  # Services métier
│   ├── storage.js            # CRUD localStorage
│   ├── markdown.js           # Parse/génère Markdown
│   ├── cloudImport.js        # Import depuis cloud
│   └── legacyImport.js       # Migration anciennes dictées
├── hooks/                     # Hooks React personnalisés
│   ├── useSpeechSynthesis.js # Synthèse vocale
│   └── useAvailableVoices.js # Détection voix disponibles
├── components/                # Composants React
│   ├── Navbar.jsx           # Barre de navigation micetf.fr
│   ├── ModeSelector.jsx      # Choix enseignant/élève
│   ├── TeacherHome.jsx       # Bibliothèque enseignant
│   ├── DictationCard.jsx     # Carte de dictée
│   ├── EditorView.jsx        # Éditeur de dictée
│   ├── LanguageSelector.jsx  # Sélecteur langue adaptatif
│   ├── PlayerView.jsx        # Lecteur élève avec étoiles
│   ├── ResultsView.jsx       # Écran résultats avec impression
│   ├── VoicesDebugView.jsx   # Diagnostic voix (enseignant)
│   ├── ImportMarkdownModal.jsx
│   ├── ImportCloudModal.jsx
│   └── MigrateLegacyModal.jsx
├── utils/                     # Utilitaires
│   ├── date.js               # Formatage dates
│   ├── validation.js         # Validation dictées
│   ├── download.js           # Export fichiers
│   ├── textComparison.js     # Comparaison textes
│   └── languages.js          # Configuration langues
├── App.jsx                    # Composant racine (navigation SPA)
├── App.css                    # Styles application
└── index.css                  # Styles globaux + Tailwind + print
```

---

## ✨ Fonctionnalités

### 👨‍🏫 Mode Enseignant

#### Gestion des dictées

- ✅ Bibliothèque avec recherche full-text
- ✅ Création/modification/suppression (CRUD complet)
- ✅ Duplication de dictées
- ✅ Tri par date de modification
- ✅ Compteur de phrases en temps réel
- ✅ Détection modifications non sauvegardées
- ✅ Choix du type de dictée (phrases / mots) avec comportement adapté de la correction.
- 📚 Bibliothèque présentée sous forme de cartes (vue enseignant)

#### Sélection de langue intelligente

- ✅ **Menu déroulant avec drapeaux** (🇫🇷 🇬🇧 🇪🇸 🇩🇪 🇮🇹)
- ✅ **Détection automatique des langues disponibles** sur le navigateur
- ✅ Langues indisponibles marquées et désactivées
- ✅ Détail déroulable des langues avec statut (✓/✗)
- ✅ Langue par défaut : Français (fr-FR)

#### Diagnostic des voix (page dédiée)

- ✅ Liste complète des voix installées sur le système
- ✅ Compatibilité par langue (vert/rouge)
- ✅ Tableau détaillé : langue, nom, local/cloud
- ✅ Permet de vérifier avant test en classe

#### Import/Export

- ✅ **Export Markdown** (.md) individuel ou groupé
- ✅ **Import fichiers locaux** (.md)
- ✅ **Import cloud** : CodiMD, Dropbox, Google Drive
- ✅ **Migration anciens liens** micetf.fr/dictee (décodage ASCII)

---

### 👦 Mode Élève

#### Lecteur de dictée avec mastéry learning

- ✅ Écoute phrase par phrase (synthèse vocale)
- ✅ **Validation obligatoire** avant passage phrase suivante
- ✅ **Maximum 3 tentatives** puis option "Passer"
- ✅ Comparaison erreur/correction côte à côte
- ✅ Messages d'encouragement contextuels (3 niveaux)
- ✅ Alerte si langue non disponible sur l'appareil
- 🧩 Sélection des dictées sous forme de cartes cliquables

#### Système d'évaluation à 3 étoiles

- ⭐⭐⭐ : Phrase juste du **premier coup**
- ⭐⭐ : Phrase juste en **2-3 essais**
- ⭐ : Phrase juste après **3+ essais**
- **(vide)** : Phrase passée sans validation

**Score final** : `(somme étoiles / phrases × 3) × 100`

**Principe pédagogique** : Mastéry learning – l'élève doit réussir chaque phrase avant de progresser, garantissant le passage par la réussite.

#### Écran de résultats détaillé

- ✅ Score total et pourcentage
- ✅ Répartition visuelle par type d'étoiles (4 cartes)
- ✅ Détail de toutes les phrases avec historique tentatives
- ✅ Bouton "Recommencer" pour refaire la dictée

#### Impression/Export PDF natif personnalisable

- ✅ **Impression native** (pas de lib externe, étoiles ⭐ parfaites)
- ✅ **Modal de personnalisation** :
    - Nom de l'élève
    - Classe
    - Nom de l'enseignant
    - Option afficher/masquer tentatives
- ✅ **Mise en page A4 ultra-compacte** :
    - Marges réduites (10mm)
    - Polices optimisées (9pt)
    - 1 page pour 15-20 phrases
- ✅ **Zones de signature** (élève + enseignant)
- ✅ En-tête, légende, pied de page
- ✅ Bouton impression rapide (sans options)

---

## 🌍 Langues supportées

| Langue      | Code  | Disponibilité typique         |
| ----------- | ----- | ----------------------------- |
| 🇫🇷 Français | fr-FR | Chrome, Safari, Edge, Firefox |
| 🇬🇧 Anglais  | en-US | Chrome, Safari, Edge, Firefox |
| 🇪🇸 Espagnol | es-ES | Chrome, Safari, Edge          |
| 🇩🇪 Allemand | de-DE | Chrome, Edge                  |
| 🇮🇹 Italien  | it-IT | Chrome, Edge                  |

> **⚠️ Important** : La disponibilité des langues dépend du **navigateur** et du **système d'exploitation**. Utilisez la page **"Langues disponibles"** dans l'app pour vérifier votre configuration avant un test en classe.

---

## 🌐 Compatibilité navigateurs

### Web Speech API (Synthèse vocale)

- ✅ **Chrome / Edge** : Support complet, toutes les langues
- ✅ **Safari** : Support complet sur macOS/iOS
- ⚠️ **Firefox** : Support limité, moins de voix disponibles
- ❌ **Internet Explorer** : Non supporté

**Recommandation terrain** : **Chrome sur tablettes** pour meilleur support multilingue.

### Impression PDF

- ✅ Tous les navigateurs modernes (Chrome, Safari, Edge, Firefox)
- ✅ "Enregistrer en PDF" natif dans la boîte d'impression

---

## 📖 Utilisation

### Créer une dictée

1. Lancer l'application → **"Je suis enseignant"**
2. Cliquer sur **"Nouvelle dictée"**
3. Remplir le formulaire :
    - **Titre** : nom de la dictée (max 100 caractères)
    - **Langue** : sélectionner dans le menu déroulant
    - **Phrases** : une phrase par ligne (min 1, max 100, max 500 car/phrase)
4. Cliquer sur **"Enregistrer"**

### Vérifier les langues disponibles

1. Mode enseignant → cliquer sur **"Langues disponibles"**
2. Consulter la liste des voix détectées
3. Vérifier que la langue souhaitée est disponible (✓ vert)

### Faire une dictée (élève)

1. Lancer l'application → **"Je suis élève"**
2. Choisir une dictée dans la liste
3. **Workflow** :
    - Cliquer sur "Écouter la phrase"
    - Écrire ce qui est entendu
    - Cliquer sur "Valider ma phrase"
    - Si correct : phrase suivante automatique
    - Si incorrect : voir la correction, réessayer ou passer
4. À la fin : voir les résultats et imprimer si besoin

### Imprimer les résultats

1. À l'écran de résultats, cliquer sur **"Imprimer / PDF"**
2. Remplir les options (nom élève, classe, enseignant)
3. Choisir d'afficher ou non les tentatives
4. Cliquer sur **"Imprimer"**
5. Dans la boîte de dialogue :
    - **Imprimer sur papier** : choisir l'imprimante
    - **Sauver en PDF** : sélectionner "Enregistrer en PDF"

---

### Partager une dictée (enseignant)

Il existe deux manières de partager une dictée avec les élèves : **lien encodé** (tout est dans l’URL) ou **lien cloud** (fichier stocké ailleurs).

#### 1. Partager avec un lien encodé

1. Mode enseignant → ouvrir la bibliothèque de dictées.
2. Sur la dictée choisie, cliquer sur **\"Partager\"** puis **\"Lien direct\"**.
3. Copier le lien proposé (CTRL+C).
4. Le transmettre aux élèves (ENT, mail, QR code, etc.).

**Caractéristiques** :

- La dictée est encodée directement dans le lien.
- Aucune inscription ni stockage serveur nécessaire.
- Pratique pour des dictées simples, partagées ponctuellement.

#### 2. Partager avec un lien cloud (CodiMD / HedgeDoc, Dropbox, Drive)

1. Créer ou coller la dictée au format Markdown dans votre service (CodiMD / HedgeDoc, Dropbox, Google Drive…).
2. Récupérer le **lien de téléchargement** (par exemple : lien `.../download` dans CodiMD).
3. Dans l’application, mode enseignant → bibliothèque → **\"Partager\"** → **\"Lien cloud\"**.
4. Coller le lien, vérifier l’aperçu, puis copier l’URL finale proposée.
5. Envoyer ce lien aux élèves.

**Caractéristiques** :

- Le contenu reste stocké sur votre service (CodiMD, Drive, etc.).
- Permet de réutiliser des dictées déjà présentes sur micetf.fr/dictee-markdown. [micetf](https://micetf.fr/dictee/)

---

### Ouvrir une dictée avec un lien (élève)

Les élèves n’ont qu’un lien à ouvrir, sans passer par la bibliothèque.

#### 1. Lien encodé (`?share=...`)

1. L’élève clique sur le lien reçu (ou scanne le QR code).
2. L’application s’ouvre directement en **mode élève** sur la dictée partagée.
3. L’élève fait la dictée normalement (lecture, saisie, validation, résultats).

**Détails techniques** :

- Le paramètre `?share=...` dans l’URL contient la dictée encodée.
- La dictée n’est pas enregistrée dans la bibliothèque locale de l’élève.

#### 2. Lien cloud (`?cloud=...`)

1. L’élève clique sur le lien du type :  
   `https://…/dictee-v0/?cloud=...`
2. L’application télécharge le fichier Markdown distant (CodiMD / HedgeDoc, Dropbox, Drive…). [micetf](https://micetf.fr/dictee/?tl=fr&titre=Dict%C3%A9e+de+mots+1+-+CP+niveau+1&d%5B1%5D=117%7C110%7C101%7C32%7C109%7C97%7C109%7C105%7C&d%5B2%5D=117%7C110%7C32%7C109%7C117%7C114%7C&d%5B3%5D=117%7C110%7C101%7C32%7C118%7C97%7C99%7C104%7C101%7C&d%5B4%5D=117%7C110%7C32%7C99%7C104%7C101%7C118%7C97%7C108%7C&d%5B5%5D=117%7C110%7C101%7C32%7C102%7C111%7C117%7C114%7C109%7C105%7C&d%5B6%5D=117%7C110%7C32%7C118%7C233%7C108%7C111%7C&d%5B7%5D=117%7C110%7C101%7C32%7C114%7C117%7C99%7C104%7C101%7C&d%5B8%5D=108%7C97%7C32%7C108%7C117%7C110%7C101%7C&d%5B9%5D=117%7C110%7C32%7C108%7C105%7C111%7C110%7C&d%5B10%5D=117%7C110%7C101%7C32%7C109%7C111%7C117%7C99%7C104%7C101%7C&d%5B11%5D=&d%5B12%5D=&d%5B13%5D=&d%5B14%5D=&d%5B15%5D=&d%5B16%5D=&d%5B17%5D=&d%5B18%5D=&d%5B19%5D=&d%5B20%5D=)
3. Après chargement, la dictée s’ouvre directement en **mode élève**.

En cas de problème, un message d’erreur indique si :

- le lien est invalide,
- le fichier n’est pas au bon format Markdown,
- ou le service cloud bloque la requête (CORS).

## 📥 Import de dictées

### Depuis fichier local (.md)

1. Bibliothèque → **"Importer"** → **"Fichier local"**
2. Sélectionner un ou plusieurs fichiers `.md`
3. Vérifier l'aperçu
4. Cliquer sur **"Importer"**

### Depuis cloud (CodiMD, Dropbox, Drive)

1. Bibliothèque → **"Importer"** → **"Cloud"**
2. Coller l'URL du fichier
3. Cliquer sur **"Récupérer"**
4. Vérifier l'aperçu
5. Cliquer sur **"Importer"**

**Services supportés** :

- CodiMD / HedgeDoc (lien de partage)
- Dropbox (lien public)
- Google Drive (fichier en accès public)
- Tout lien direct vers un `.md`

> **Note CORS** : Certains services bloquent les requêtes cross-domain. CodiMD fonctionne généralement sans problème.

### Migration anciens liens (micetf.fr/dictee)

Si vous avez des dictées sur l'ancienne version :

1. Bibliothèque → **"Migrer ancien lien"**
2. Coller l'URL complète (format `?tl=fr&titre=...&d [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/40129703/08b31743-7afe-417d-b54b-3c623764587c/README.md)=...`)
3. Vérifier les phrases décodées
4. Cliquer sur **"Importer"**

**Format supporté** : URLs avec paramètres `tl`, `titre`, et `d [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/40129703/08b31743-7afe-417d-b54b-3c623764587c/README.md)`, `d[2]`, etc. (encodage ASCII)

---

## 📄 Format des fichiers Markdown

Les dictées sont exportées/importées au format **Markdown avec front matter YAML**.

**Exemple :**

```markdown
---
title: Les animaux de la ferme
language: fr-FR
---

Le coq chante le matin.
La vache donne du lait.
Les poules pondent des œufs.
```

**Spécifications** :

- Front matter YAML obligatoire (`title`, `language`)
- Une phrase par ligne (hors front matter)
- Lignes vides ignorées
- Encodage UTF-8
- Champ optionnel `type` :
    - `sentences` : dictée de phrases (ponctuation et majuscules évaluées)
    - `words` : dictée de mots (ponctuation ignorée, casse non pénalisante)

Voir `docs/FORMAT_MARKDOWN.md` pour plus de détails.

---

## ⚙️ Limitations connues

- **Stockage** : localStorage limité (~5-10 Mo selon navigateurs)
- **Nombre de dictées** : ~50 dictées max recommandées
- **Synchronisation** : Pas de sync multi-appareils (stockage local uniquement)
- **Mode hors-ligne** : PWA désactivée pour V0 (à venir)
- **Langues** : Dépend des voix installées sur l'appareil

---

## 🚧 Développement

### Sprints réalisés (V0.10)

| Sprint | Fonctionnalité                         | Statut |
| ------ | -------------------------------------- | ------ |
| 1      | Modèle de données + localStorage       | ✅     |
| 2      | Navigation SPA + sélection mode        | ✅     |
| 3      | Bibliothèque enseignant (CRUD)         | ✅     |
| 4      | Éditeur de dictée avec validation      | ✅     |
| 5      | Lecteur élève avec synthèse vocale     | ✅     |
| 6      | Import/export Markdown                 | ✅     |
| 7      | Import cloud (CodiMD, Dropbox, Drive)  | ✅     |
| 8      | Migration anciens liens (legacy)       | ✅     |
| 9      | Système étoiles + impression native    | ✅     |
| 10     | Sélection langue + diagnostic voix     | ✅     |
| 11     | 8 dictées par défaut (prêt à l'emploi) | ✅     |

### Prochaines étapes possibles

- **Sprint 11** : Optimisation tablettes (CSS touch-friendly)
- **Sprint 12** : PWA (mode hors-ligne, installable)
- **Sprint 13** : Statistiques enseignant
- **Sprint 14** : Historique sessions élève
- **Sprint 15** : Mode entraînement vs évaluation

---

## 🧪 Tests recommandés avant déploiement

### Tests navigateurs

- [ ] Chrome : toutes fonctionnalités
- [ ] Safari : synthèse vocale + impression
- [ ] Firefox : vérifier voix disponibles
- [ ] Edge : validation complète

### Tests tablettes (recommandé)

- [ ] iPad : création dictée + lecture élève
- [ ] Tablette Android : idem
- [ ] Clavier virtuel ne cache pas l'input
- [ ] Boutons suffisamment grands (touch)

### Tests terrain

- [ ] Créer 3 dictées de démo (5-10 phrases)
- [ ] Tester avec 2-3 élèves réels
- [ ] Imprimer résultats
- [ ] Vérifier synthèse vocale audible (volume)

---

## 📚 Documentation complémentaire

- `CHANGELOG.md` : Historique détaillé des versions
- `docs/FORMAT_MARKDOWN.md` : Spécifications format fichiers
- `docs/ARCHITECTURE.md` : Architecture technique (à venir)
- `docs/GUIDE_ENSEIGNANT.md` : Guide utilisateur PE (à venir)

---

## 🤝 Contribution

Ce projet est développé de manière **incrémentale par sprints**.  
Chaque sprint est documenté dans le `CHANGELOG.md`.

**Workflow :**

1. Objectif sprint défini
2. Code fonctionnel développé
3. Tests manuels validés
4. Documentation mise à jour
5. Commit conventionnel en français

---

## 📜 Licence

MIT

---

## 📧 Contact

**Projet micetf.fr**  
École primaire française  
Développé pour les cycles 1 à 3

---

## ⭐ Remerciements

Merci aux enseignants testeurs et aux élèves pour leurs retours terrain.

---

**Version 0.11** - Février 2026 - Sprints 1 à 11 complétés
