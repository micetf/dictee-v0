/**
 * Utilitaires pour comparer deux textes et identifier les différences
 */

/**
 * Normalise un texte pour comparaison
 * @param {string} text - Texte à normaliser
 * @returns {string} Texte normalisé
 */
export function normalizeText(text) {
    return text.toLowerCase().trim().replace(/\s+/g, " "); // Espaces multiples → espace unique
}

/**
 * Compare deux textes et retourne s'ils sont identiques (insensible casse/espaces)
 * @param {string} text1 - Premier texte
 * @param {string} text2 - Deuxième texte
 * @returns {boolean} true si identiques
 */
export function areTextsEqual(text1, text2) {
    return normalizeText(text1) === normalizeText(text2);
}

/**
 * Identifie les mots différents entre deux textes
 * @param {string} userText - Texte de l'utilisateur
 * @param {string} expectedText - Texte attendu
 * @returns {Array} Tableau d'objets {word, isCorrect, expected}
 */
export function compareWords(userText, expectedText) {
    const userWords = normalizeText(userText).split(" ");
    const expectedWords = normalizeText(expectedText).split(" ");

    const maxLength = Math.max(userWords.length, expectedWords.length);
    const comparison = [];

    for (let i = 0; i < maxLength; i++) {
        const userWord = userWords[i] || "";
        const expectedWord = expectedWords[i] || "";

        comparison.push({
            user: userWord,
            expected: expectedWord,
            isCorrect: userWord === expectedWord,
            index: i,
        });
    }

    return comparison;
}
