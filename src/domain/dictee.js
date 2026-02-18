/**
 * Crée une dictée vide avec un ID unique
 * @returns {Object} Nouvelle dictée
 */
export function createEmptyDictee() {
    return {
        id: crypto.randomUUID(),
        title: "",
        language: "fr-FR",
        sentences: [],
        type: "sentences", // "sentences" | "words"
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
}

/**
 * Valide la structure d'une dictée
 * @param {Object} dictee - Dictée à valider
 * @returns {boolean} true si valide
 */
export function isValidDictee(dictee) {
    return (
        dictee &&
        typeof dictee.id === "string" &&
        typeof dictee.title === "string" &&
        typeof dictee.language === "string" &&
        Array.isArray(dictee.sentences) &&
        (dictee.type === "sentences" || dictee.type === "words") &&
        typeof dictee.createdAt === "number" &&
        typeof dictee.updatedAt === "number"
    );
}
