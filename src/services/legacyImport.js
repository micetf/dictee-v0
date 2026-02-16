/**
 * Service de migration des anciennes dictées depuis micetf.fr/dictee
 * Format legacy : paramètres URL avec phrases encodées en codes ASCII
 * Exemple : ?tl=fr&titre=Test&d[1]=66|111|110|106|111|117|114
 */

/**
 * Décode une phrase encodée en codes ASCII séparés par |
 * @param {string} encoded - Chaîne de codes ASCII séparés par |
 * @returns {string} Phrase décodée
 */
function decodeAsciiPhrase(encoded) {
    if (!encoded || encoded.trim().length === 0) {
        return "";
    }

    try {
        const codes = encoded.split("|").filter((c) => c.length > 0);
        const chars = codes.map((code) =>
            String.fromCharCode(parseInt(code, 10))
        );
        return chars.join("");
    } catch (error) {
        console.error("Erreur décodage phrase:", encoded, error);
        return "";
    }
}

/**
 * Normalise un code langue legacy vers BCP 47
 * @param {string} legacyLang - Code langue legacy (ex: "fr", "en")
 * @returns {string} Code BCP 47 (ex: "fr-FR", "en-US")
 */
function normalizeLegacyLanguage(legacyLang) {
    const mapping = {
        fr: "fr-FR",
        en: "en-US",
        es: "es-ES",
        de: "de-DE",
        it: "it-IT",
        pt: "pt-PT",
        nl: "nl-NL",
        ru: "ru-RU",
        ar: "ar-SA",
        zh: "zh-CN",
        ja: "ja-JP",
    };

    const normalized = legacyLang?.toLowerCase().trim();
    return mapping[normalized] || normalized || "fr-FR";
}

/**
 * Parse une URL legacy et extrait la dictée
 * @param {string} url - URL complète ou query string
 * @returns {Object} Dictée parsée (sans id, createdAt, updatedAt)
 * @throws {Error} Si le format est invalide
 */
export function parseLegacyUrl(url) {
    if (!url || typeof url !== "string") {
        throw new Error("URL invalide");
    }

    let queryString = url.trim();

    // Si c'est une URL complète, extraire la query string
    if (queryString.includes("?")) {
        const parts = queryString.split("?");
        if (parts.length < 2) {
            throw new Error("Aucun paramètre trouvé dans l'URL");
        }
        queryString = parts[1];
    }

    // Parser les paramètres
    const params = new URLSearchParams(queryString);

    // Extraire titre
    const title = params.get("titre") || params.get("title") || "Dictée migrée";

    // Extraire langue
    const legacyLang = params.get("tl") || params.get("lang") || "fr";
    const language = normalizeLegacyLanguage(legacyLang);

    // Extraire les phrases (format d[1], d[2], etc.)
    const sentences = [];
    let index = 1;

    while (true) {
        const key = `d[${index}]`;
        const encoded = params.get(key);

        if (!encoded || encoded.trim().length === 0) {
            break; // Plus de phrases
        }

        const decoded = decodeAsciiPhrase(encoded);
        if (decoded.length > 0) {
            sentences.push(decoded);
        }

        index++;

        // Sécurité : limite à 100 phrases
        if (index > 100) {
            break;
        }
    }

    if (sentences.length === 0) {
        throw new Error(
            "Aucune phrase trouvée dans l'URL. Vérifiez le format (d[1], d[2], etc.)"
        );
    }

    return {
        title: decodeURIComponent(title),
        language,
        sentences,
    };
}

/**
 * Valide qu'une URL est au format legacy
 * @param {string} url - URL à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateLegacyUrl(url) {
    try {
        parseLegacyUrl(url);
        return { valid: true, error: null };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

/**
 * Détecte si une URL ressemble à une URL legacy
 * @param {string} url - URL à analyser
 * @returns {boolean} true si probable URL legacy
 */
export function isLegacyUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }

    const lowerUrl = url.toLowerCase();

    // Indices d'URL legacy
    return (
        (lowerUrl.includes("micetf.fr/dictee") || lowerUrl.includes("d[1]")) &&
        !lowerUrl.includes(".md")
    );
}
