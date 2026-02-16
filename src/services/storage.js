import { v4 as uuidv4 } from "uuid";
import { DEFAULT_DICTATIONS } from "../data/defaultDictations";

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
 * Charge les dictées par défaut au premier lancement
 */
function loadDefaultDictations() {
    const now = Date.now();

    const dictationsToLoad = DEFAULT_DICTATIONS.map((dict, index) => ({
        id: uuidv4(),
        title: dict.title,
        language: dict.language,
        sentences: dict.sentences,
        markdown: "", // Sera régénéré si besoin
        createdAt: now + index, // Décalage pour ordre stable
        updatedAt: now + index,
    }));

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dictationsToLoad));
        console.log(
            `✅ ${dictationsToLoad.length} dictées par défaut chargées`
        );
    } catch (error) {
        console.error("❌ Erreur chargement dictées par défaut:", error);
    }
}

/**
 * Liste toutes les dictées
 * Charge les dictées par défaut au premier lancement
 * @returns {Array} Tableau de dictées
 */
export function listDictations() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        // Premier lancement : aucune donnée
        if (!stored) {
            console.log(
                "Premier lancement détecté, chargement des dictées par défaut..."
            );
            loadDefaultDictations();
            // Relire après chargement
            const storedAfterLoad = localStorage.getItem(STORAGE_KEY);
            return storedAfterLoad ? JSON.parse(storedAfterLoad) : [];
        }

        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Erreur lecture localStorage:", error);
        return [];
    }
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
 * Duplique une dictée
 * @param {string} id - ID de la dictée à dupliquer
 * @returns {string|null} ID de la nouvelle dictée ou null si erreur
 */
export function duplicateDictation(id) {
    const original = getDictation(id);
    if (!original) return null;

    const now = Date.now();
    const duplicate = {
        ...original,
        id: uuidv4(),
        title: `${original.title} (copie)`,
        createdAt: now,
        updatedAt: now,
    };

    saveDictation(duplicate);
    return duplicate.id;
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

/**
 * Réinitialise la bibliothèque avec les dictées par défaut
 * ATTENTION : Supprime toutes les dictées existantes
 * @returns {boolean} true si succès
 */
export function resetToDefaultDictations() {
    if (
        !window.confirm(
            "⚠️ ATTENTION : Cette action va supprimer toutes vos dictées actuelles et les remplacer par les 8 dictées par défaut.\n\nContinuer ?"
        )
    ) {
        return false;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
        loadDefaultDictations();
        console.log("✅ Bibliothèque réinitialisée");
        return true;
    } catch (error) {
        console.error("❌ Erreur réinitialisation:", error);
        return false;
    }
}
