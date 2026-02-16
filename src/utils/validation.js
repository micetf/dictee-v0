/**
 * Fonctions de validation pour les dictées
 */

/**
 * Valide le titre d'une dictée
 * @param {string} title - Titre à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateTitle(title) {
    if (!title || title.trim().length === 0) {
        return { valid: false, error: "Le titre ne peut pas être vide" };
    }
    if (title.length > 100) {
        return {
            valid: false,
            error: "Le titre ne peut pas dépasser 100 caractères",
        };
    }
    return { valid: true, error: null };
}

/**
 * Valide le code langue BCP 47
 * @param {string} language - Code langue à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateLanguage(language) {
    if (!language || language.trim().length === 0) {
        return { valid: false, error: "La langue ne peut pas être vide" };
    }
    // Format basique : 2 lettres, optionnel -2 lettres (ex: fr, fr-FR, en-US)
    const pattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    if (!pattern.test(language)) {
        return {
            valid: false,
            error: "Format invalide (exemples valides : fr, fr-FR, en-US)",
        };
    }
    return { valid: true, error: null };
}

/**
 * Valide les phrases d'une dictée
 * @param {Array<string>} sentences - Phrases à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateSentences(sentences) {
    if (!Array.isArray(sentences) || sentences.length === 0) {
        return { valid: false, error: "Au moins une phrase est requise" };
    }
    if (sentences.length > 100) {
        return { valid: false, error: "Maximum 100 phrases par dictée" };
    }
    // Vérifier qu'aucune phrase n'est trop longue
    const tooLong = sentences.find((s) => s.length > 500);
    if (tooLong) {
        return {
            valid: false,
            error: "Une phrase ne peut pas dépasser 500 caractères",
        };
    }
    return { valid: true, error: null };
}

/**
 * Valide une dictée complète
 * @param {Object} dictation - Dictée à valider
 * @returns {Object} { valid: boolean, errors: Object }
 */
export function validateDictation(dictation) {
    const titleCheck = validateTitle(dictation.title);
    const languageCheck = validateLanguage(dictation.language);
    const sentencesCheck = validateSentences(dictation.sentences);

    return {
        valid: titleCheck.valid && languageCheck.valid && sentencesCheck.valid,
        errors: {
            title: titleCheck.error,
            language: languageCheck.error,
            sentences: sentencesCheck.error,
        },
    };
}
