/**
 * Service d'import de dictées depuis des services cloud
 * Supporte : CodiMD, HedgeDoc, Dropbox, Google Drive (liens publics)
 */

/**
 * Normalise une URL Dropbox pour obtenir le lien de téléchargement direct
 * @param {string} url - URL Dropbox
 * @returns {string} URL de téléchargement direct
 */
function normalizeDropboxUrl(url) {
    // Remplacer www.dropbox.com par dl.dropboxusercontent.com
    // et ?dl=0 par ?dl=1
    return url
        .replace("www.dropbox.com", "dl.dropboxusercontent.com")
        .replace("?dl=0", "?dl=1")
        .replace(/&dl=0$/, "&dl=1");
}

/**
 * Normalise une URL CodiMD/HedgeDoc pour obtenir le markdown brut
 * @param {string} url - URL CodiMD/HedgeDoc
 * @returns {string} URL du markdown brut
 */
function normalizeCodiMDUrl(url) {
    // Formats possibles :
    // https://codimd.example.com/s/abc123
    // https://codimd.example.com/abc123
    // → https://codimd.example.com/s/abc123/download

    if (url.includes("/download")) {
        return url; // Déjà au bon format
    }

    // Ajouter /download à la fin
    const cleanUrl = url.replace(/\/$/, ""); // Retirer slash final si présent

    if (cleanUrl.includes("/s/")) {
        return `${cleanUrl}/download`;
    }

    // Si pas de /s/, on l'ajoute
    const parts = cleanUrl.split("/");
    const noteId = parts[parts.length - 1];
    const baseUrl = parts.slice(0, -1).join("/");
    return `${baseUrl}/s/${noteId}/download`;
}

/**
 * Normalise une URL Google Drive pour obtenir le contenu direct
 * @param {string} url - URL Google Drive
 * @returns {string} URL de téléchargement direct
 */
function normalizeGoogleDriveUrl(url) {
    // Format : https://drive.google.com/file/d/FILE_ID/view
    // → https://drive.google.com/uc?export=download&id=FILE_ID

    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        const fileId = match[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return url;
}

/**
 * Détecte le type de service cloud depuis une URL
 * @param {string} url - URL à analyser
 * @returns {string} Type de service ("codimd" | "dropbox" | "gdrive" | "raw")
 */
function detectCloudService(url) {
    const urlLower = url.toLowerCase();

    if (urlLower.includes("codimd") || urlLower.includes("hedgedoc")) {
        return "codimd";
    }
    if (urlLower.includes("dropbox")) {
        return "dropbox";
    }
    if (urlLower.includes("drive.google.com")) {
        return "gdrive";
    }

    // Par défaut, on suppose que c'est un lien direct vers un fichier markdown
    return "raw";
}

/**
 * Normalise une URL selon le service détecté
 * @param {string} url - URL à normaliser
 * @returns {string} URL normalisée
 */
function normalizeCloudUrl(url) {
    const service = detectCloudService(url);

    switch (service) {
        case "codimd":
            return normalizeCodiMDUrl(url);
        case "dropbox":
            return normalizeDropboxUrl(url);
        case "gdrive":
            return normalizeGoogleDriveUrl(url);
        default:
            return url;
    }
}

/**
 * Fetch le contenu markdown depuis une URL cloud
 * @param {string} url - URL du fichier markdown
 * @returns {Promise<string>} Contenu markdown
 * @throws {Error} Si le fetch échoue
 */
export async function fetchMarkdownFromCloud(url) {
    if (!url || typeof url !== "string") {
        throw new Error("URL invalide");
    }

    const normalizedUrl = normalizeCloudUrl(url.trim());

    try {
        const response = await fetch(normalizedUrl, {
            method: "GET",
            headers: {
                Accept: "text/markdown, text/plain, */*",
            },
            // Mode CORS si possible, sinon no-cors (mais limite l'accès au contenu)
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(
                `Erreur HTTP ${response.status} : ${response.statusText}`
            );
        }

        const contentType = response.headers.get("content-type");

        // Vérifier que c'est bien du texte
        if (
            contentType &&
            !contentType.includes("text") &&
            !contentType.includes("markdown")
        ) {
            console.warn("Type de contenu inattendu:", contentType);
        }

        const content = await response.text();

        if (!content || content.trim().length === 0) {
            throw new Error("Le fichier est vide");
        }

        return content;
    } catch (error) {
        // Gérer les erreurs CORS
        if (
            error.name === "TypeError" &&
            error.message.includes("Failed to fetch")
        ) {
            throw new Error(
                "Impossible d'accéder au fichier. Vérifiez que le lien est public et que le service autorise les accès CORS."
            );
        }

        throw error;
    }
}

/**
 * Obtient des informations sur le service cloud à partir d'une URL
 * @param {string} url - URL à analyser
 * @returns {Object} Infos : { service, serviceLabel, normalizedUrl }
 */
export function getCloudServiceInfo(url) {
    const service = detectCloudService(url);
    const normalizedUrl = normalizeCloudUrl(url);

    const serviceLabels = {
        codimd: "CodiMD / HedgeDoc",
        dropbox: "Dropbox",
        gdrive: "Google Drive",
        raw: "Lien direct",
    };

    return {
        service,
        serviceLabel: serviceLabels[service] || "Inconnu",
        normalizedUrl,
    };
}
