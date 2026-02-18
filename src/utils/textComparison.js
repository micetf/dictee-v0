/**
 * Utilitaires pour comparer deux textes et identifier les différences
 */

/**
 * Normalise un texte pour comparaison (base)
 * @param {string} text - Texte à normaliser
 * @returns {string} Texte normalisé
 */
export function normalizeText(text) {
    return text.trim().replace(/\s+/g, " "); // Espaces multiples → espace unique
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
 * @returns {Array} Tableau d'objets {user, expected, isCorrect, index}
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

/**
 * Normalisation spéciale pour le mode "mots" :
 * on ignore la ponctuation en début/fin de chaîne.
 * @param {string} text
 * @returns {string}
 */
function normalizeForWordMode(text) {
    const base = normalizeText(text).toLowerCase();
    return base
        .replace(/^[.,;:!?«»"()[\]]+/g, "")
        .replace(/[.,;:!?«»"()[\]]+$/g, "");
}

/**
 * Compare une réponse en tenant compte du type de dictée.
 * @param {string} answer
 * @param {string} expected
 * @param {"sentences"|"words"} type
 * @returns {boolean}
 */
export function isAnswerCorrect(answer, expected, type = "sentences") {
    if (type === "words") {
        const normAnswer = normalizeForWordMode(answer);
        const normExpected = normalizeForWordMode(expected);
        return normAnswer === normExpected;
    }

    // Mode phrases : casse et ponctuation comptent,
    // on ne normalise que les espaces.
    const normAnswer = normalizeText(answer);
    const normExpected = normalizeText(expected);
    return normAnswer === normExpected;
}
