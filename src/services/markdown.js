/**
 * Service de parsing et génération de fichiers Markdown pour les dictées
 * Format : front matter YAML + phrases ligne par ligne
 */

/**
 * Parse un contenu markdown en objet dictée
 * @param {string} markdownContent - Contenu du fichier .md
 * @returns {Object} Dictée parsée (sans id, createdAt, updatedAt)
 * @throws {Error} Si le format est invalide
 */
export function parseMarkdown(markdownContent) {
    if (!markdownContent || typeof markdownContent !== "string") {
        throw new Error("Contenu markdown invalide");
    }

    const lines = markdownContent.split("\n");

    // Vérifier le front matter
    if (lines.length < 3 || lines[0].trim() !== "---") {
        throw new Error(
            "Format invalide : front matter manquant (doit commencer par ---)"
        );
    }

    // Trouver la fin du front matter
    let endFrontMatterIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "---") {
            endFrontMatterIndex = i;
            break;
        }
    }

    if (endFrontMatterIndex === -1) {
        throw new Error(
            "Format invalide : front matter non fermé (--- manquant)"
        );
    }

    // Parser le front matter
    const frontMatterLines = lines.slice(1, endFrontMatterIndex);
    const metadata = {};

    for (const line of frontMatterLines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;

        const colonIndex = trimmed.indexOf(":");
        if (colonIndex === -1) continue;

        const key = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();
        metadata[key] = value;
    }

    // Valider les métadonnées obligatoires
    if (!metadata.title) {
        throw new Error("Métadonnée 'title' manquante dans le front matter");
    }
    if (!metadata.language) {
        throw new Error("Métadonnée 'language' manquante dans le front matter");
    }

    // Parser les phrases (après le front matter)
    const sentenceLines = lines.slice(endFrontMatterIndex + 1);
    const sentences = sentenceLines
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (sentences.length === 0) {
        throw new Error("Aucune phrase trouvée dans le fichier");
    }

    return {
        title: metadata.title,
        language: metadata.language,
        sentences,
    };
}

/**
 * Génère un contenu markdown à partir d'une dictée
 * @param {Object} dictation - Dictée à exporter
 * @returns {string} Contenu markdown
 */
export function generateMarkdown(dictation) {
    if (!dictation) {
        throw new Error("Dictée invalide");
    }

    const { title, language, sentences } = dictation;

    if (
        !title ||
        !language ||
        !Array.isArray(sentences) ||
        sentences.length === 0
    ) {
        throw new Error(
            "Dictée incomplète (title, language, sentences requis)"
        );
    }

    // Construire le front matter
    const frontMatter = [
        "---",
        `title: ${title}`,
        `language: ${language}`,
        "---",
        "", // ligne vide après le front matter
    ].join("\n");

    // Ajouter les phrases
    const body = sentences.join("\n");

    return frontMatter + body + "\n";
}

/**
 * Valide qu'une chaîne est un markdown de dictée valide
 * @param {string} markdownContent - Contenu à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateMarkdown(markdownContent) {
    try {
        parseMarkdown(markdownContent);
        return { valid: true, error: null };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}
