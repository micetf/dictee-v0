// src/utils/helpContent.js

export const helpContent = {
    home: {
        title: "Je crée mes dictées – Markdown",
        icon: "ℹ️",
        body: [
            "Cet outil permet de créer, partager et faire des dictées en ligne pour l’école primaire (cycles 2 et 3).",
            "Choisissez « Je suis enseignant » pour préparer vos dictées (mots ou phrases), les organiser et les partager.",
            "Choisissez « Je suis élève » pour lancer une dictée préparée par l’enseignant, avec écoute audio et système d’étoiles.",
            "L’objectif est de travailler l’orthographe de façon progressive, avec un retour immédiat et la possibilité de réutiliser facilement les dictées d’une année sur l’autre.",
        ],
    },

    teacher: {
        teacherHome: {
            title: "Aide – Bibliothèque enseignant",
            icon: "📚",
            body: [
                "Cette vue rassemble toutes vos dictées.",
                "Vous pouvez créer une nouvelle dictée, modifier une dictée existante, la dupliquer ou la supprimer.",
                "Les boutons d’import/export permettent de sauvegarder vos dictées au format Markdown, de les partager avec des collègues et de les conserver d’une année sur l’autre.",
                "Vous pouvez également générer des liens de partage pour que les élèves accèdent directement à une dictée en mode élève (via ENT, mail ou QR code).",
                "Utilisez la bibliothèque comme un répertoire de séquences : chaque dictée peut être reliée à une notion (accord, sons, mots invariables, etc.).",
            ],
        },

        editor: {
            title: "Aide – Éditeur de dictée",
            icon: "✏️",
            body: [
                "Dans cette vue, vous construisez la dictée donnée aux élèves.",
                "Renseignez un titre explicite (ex. « Mots invariables CE1 – série 3 »), la langue (fr-FR, en-US…) et le type de dictée.",
                "Type de dictée : « dictée de phrases » (majuscules et ponctuation comptent) ou « dictée de mots » (focalisation sur l’orthographe lexicale, ponctuation ignorée).",
                "En dictée de mots, travaillez les mots invariables ou des listes liées à une notion ; en dictée de phrases, ciblez une notion précise et limitez la longueur pour garder un temps de dictée raisonnable.",
                "Vous pouvez créer plusieurs versions d’une même dictée pour différencier (versions A/B, niveaux différents).",
            ],
        },

        player: {
            title: "Aide – Aperçu mode élève",
            icon: "👀",
            body: [
                "Vous voyez ici la dictée exactement comme l’élève la verra : écoute phrase par phrase, zone de saisie et système d’étoiles.",
                "Cette vue est utile pour tester une dictée avant la séance : vérifier la prononciation, la longueur des phrases et la difficulté globale.",
                "Vous pouvez repérer les points de vigilance (mots difficiles, accords, ponctuation) et décider si la dictée convient à votre groupe d’élèves.",
                "N’hésitez pas à faire vous-même la dictée une fois pour ajuster le nombre de phrases ou le niveau de difficulté avant de la proposer à la classe.",
            ],
        },
    },

    student: {
        list: {
            title: "Aide – Choisir une dictée",
            icon: "🧩",
            body: [
                "Cette page présente les dictées qui ont été préparées sur cet ordinateur.",
                "Chaque carte correspond à une dictée : titre, nombre de phrases et langue.",
                "L’élève clique sur une carte pour démarrer la dictée.",
                "Côté organisation de classe, vous pouvez préparer plusieurs dictées (niveaux, thèmes) et laisser les élèves choisir selon un plan de travail ou une consigne précise.",
                "Veillez à nommer les dictées de manière explicite : niveau (CP, CE1…), type (mots/phrases) et objectif (« Mots invariables – série 2 »).",
            ],
        },

        playerSentences: {
            title: "Aide – Faire une dictée de phrases",
            icon: "🗣️",
            body: [
                "La dictée se fait phrase par phrase : l’élève écoute, écrit puis valide.",
                "L’élève doit réussir une phrase avant de passer à la suivante (mastéry learning) et dispose de jusqu’à 3 essais avant de pouvoir passer.",
                "En dictée de phrases, les majuscules et la ponctuation comptent : l’élève travaille à la fois l’orthographe lexicale et grammaticale.",
                "Le système d’étoiles distingue la réussite du premier coup, la réussite après quelques essais et les phrases passées.",
                "Utilisez ce mode plutôt en entraînement ou en évaluation formative, puis appuyez-vous sur l’écran de résultats pour un retour collectif sur les difficultés rencontrées.",
            ],
        },

        playerWords: {
            title: "Aide – Faire une dictée de mots",
            icon: "🔤",
            body: [
                "La dictée se fait mot par mot : l’élève écoute chaque mot et l’écrit dans la zone de saisie.",
                "En dictée de mots, la ponctuation éventuelle autour du mot n’est pas prise en compte dans la correction : on se concentre sur l’orthographe lexicale.",
                "Les majuscules ne sont pas pénalisantes dans ce mode, l’enjeu principal est la bonne suite de lettres.",
                "Ce mode est particulièrement adapté pour les mots invariables, les sons complexes ou les listes de mots liés à une notion étudiée.",
                "Le système d’étoiles fonctionne comme pour les phrases et permet de visualiser les réussites et les besoins de renforcement.",
            ],
        },
    },
};
