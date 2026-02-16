/**
 * Service de stockage des dictées dans localStorage
 * Limite : ~5-10 Mo selon navigateurs, OK pour ~50 dictées
 */

const STORAGE_KEY = "dictee-markdown-v0:dictations";

/**
 * Charge toutes les dictées depuis localStorage
 * @returns {Array} Tableau de dictées
 */
function loadAllRaw() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Erreur lecture localStorage:", error);
        return [];
    }
}

/**
 * Sauvegarde toutes les dictées dans localStorage
 * @param {Array} dictations - Tableau de dictées
 */
function saveAllRaw(dictations) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dictations));
    } catch (error) {
        console.error("Erreur écriture localStorage:", error);
        throw new Error("Impossible de sauvegarder (quota dépassé ?)");
    }
}

/**
 * Liste toutes les dictées
 * @returns {Array} Tableau de dictées
 */
export function listDictations() {
    return loadAllRaw();
}

/**
 * Récupère une dictée par son ID
 * @param {string} id - ID de la dictée
 * @returns {Object|null} Dictée ou null si non trouvée
 */
export function getDictation(id) {
    return loadAllRaw().find((d) => d.id === id) ?? null;
}

/**
 * Sauvegarde ou met à jour une dictée
 * @param {Object} dictation - Dictée à sauvegarder
 */
export function saveDictation(dictation) {
    const all = loadAllRaw();
    const idx = all.findIndex((d) => d.id === dictation.id);

    const updated = {
        ...dictation,
        updatedAt: Date.now(),
    };

    if (idx === -1) {
        all.push(updated);
    } else {
        all[idx] = updated;
    }

    saveAllRaw(all);
}

/**
 * Supprime une dictée
 * @param {string} id - ID de la dictée à supprimer
 */
export function deleteDictation(id) {
    const all = loadAllRaw().filter((d) => d.id !== id);
    saveAllRaw(all);
}

/**
 * Compte le nombre de dictées
 * @returns {number} Nombre de dictées stockées
 */
export function countDictations() {
    return loadAllRaw().length;
}

/**
 * Vide complètement le stockage (pour debug)
 */
export function clearAllDictations() {
    localStorage.removeItem(STORAGE_KEY);
}
