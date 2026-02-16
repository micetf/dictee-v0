/**
 * Utilitaires pour télécharger des fichiers côté client
 */

/**
 * Déclenche le téléchargement d'un fichier texte
 * @param {string} content - Contenu du fichier
 * @param {string} filename - Nom du fichier
 * @param {string} mimeType - Type MIME (défaut: text/markdown)
 */
export function downloadTextFile(
    content,
    filename,
    mimeType = "text/markdown"
) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Ajouter au DOM, cliquer, puis retirer (nécessaire pour certains navigateurs)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libérer la mémoire
    URL.revokeObjectURL(url);
}

/**
 * Génère un nom de fichier sûr (sans caractères spéciaux)
 * @param {string} title - Titre à nettoyer
 * @returns {string} Nom de fichier sûr
 */
export function sanitizeFilename(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ""); // Retirer les tirets en début/fin
}
