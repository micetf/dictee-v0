/**
 * Service de partage de dictées
 * Gère l'encodage/décodage et la génération de liens partageables
 */

const MAX_URL_LENGTH = 2000; // Limite navigateurs
const MAX_PHRASES_ENCODAGE = 20; // Limite recommandée

/**
 * Encode une dictée en base64 pour inclusion dans URL
 * @param {Object} dictation - Dictée à encoder
 * @returns {string} Chaîne base64
 */
export function encodeDictation(dictation) {
    const payload = {
        title: dictation.title,
        language: dictation.language,
        sentences: dictation.sentences,
    };

    const json = JSON.stringify(payload);
    const base64 = btoa(unescape(encodeURIComponent(json))); // Support UTF-8

    return base64;
}

/**
 * Décode une dictée depuis base64
 * @param {string} encoded - Chaîne base64
 * @returns {Object|null} Dictée décodée ou null si erreur
 */
export function decodeDictation(encoded) {
    try {
        const json = decodeURIComponent(escape(atob(encoded)));
        const parsed = JSON.parse(json);

        // Validation basique
        if (
            !parsed.title ||
            !parsed.language ||
            !Array.isArray(parsed.sentences)
        ) {
            throw new Error("Format de dictée invalide");
        }

        return parsed;
    } catch (error) {
        console.error("Erreur décodage dictée:", error);
        return null;
    }
}

/**
 * Génère un lien de partage par encodage
 * @param {Object} dictation - Dictée à partager
 * @param {string} baseUrl - URL de base de l'application
 * @returns {Object} { url, success, error, tooLong }
 */
export function generateShareLink(dictation, baseUrl = window.location.origin) {
    // Vérification limite phrases
    if (dictation.sentences.length > MAX_PHRASES_ENCODAGE) {
        return {
            success: false,
            error: "too_many_sentences",
            tooLong: true,
            maxSentences: MAX_PHRASES_ENCODAGE,
        };
    }

    const encoded = encodeDictation(dictation);
    const url = `${baseUrl}/?share=${encoded}`;

    // Vérification longueur URL
    if (url.length > MAX_URL_LENGTH) {
        return {
            success: false,
            error: "url_too_long",
            tooLong: true,
            urlLength: url.length,
            maxLength: MAX_URL_LENGTH,
        };
    }

    return {
        success: true,
        url,
        encoded,
    };
}

/**
 * Génère un lien de partage via cloud
 * @param {string} cloudUrl - URL du fichier sur le cloud
 * @param {string} baseUrl - URL de base de l'application
 * @returns {string} Lien de partage
 */
export function generateCloudShareLink(
    cloudUrl,
    baseUrl = window.location.origin
) {
    const encoded = encodeURIComponent(cloudUrl);
    return `${baseUrl}/?cloud=${encoded}`;
}

/**
 * Vérifie si une dictée peut être partagée par encodage
 * @param {Object} dictation - Dictée à vérifier
 * @returns {Object} { canShare, reason }
 */
export function canShareByEncoding(dictation) {
    if (!dictation || !dictation.sentences) {
        return { canShare: false, reason: "Dictée invalide" };
    }

    if (dictation.sentences.length > MAX_PHRASES_ENCODAGE) {
        return {
            canShare: false,
            reason: `Trop de phrases (max ${MAX_PHRASES_ENCODAGE})`,
        };
    }

    // Estimation longueur URL
    const testLink = generateShareLink(dictation);
    if (!testLink.success) {
        return {
            canShare: false,
            reason: "URL trop longue",
        };
    }

    return { canShare: true };
}

/**
 * Extrait l'origine du cloud depuis une URL
 * @param {string} cloudUrl - URL du fichier cloud
 * @returns {string} Nom du service (CodiMD, Nuage, Dropbox, etc.)
 */
export function getCloudServiceName(cloudUrl) {
    if (!cloudUrl) return "Cloud";

    if (cloudUrl.includes("codimd") || cloudUrl.includes("hedgedoc")) {
        return "CodiMD";
    }
    if (cloudUrl.includes("nuage") || cloudUrl.includes("nextcloud")) {
        return "Nuage";
    }
    if (cloudUrl.includes("dropbox")) {
        return "Dropbox";
    }
    if (cloudUrl.includes("drive.google")) {
        return "Google Drive";
    }

    return "Cloud";
}
