import { useState, useEffect } from "react";

/**
 * Hook pour détecter les voix de synthèse vocale disponibles
 * @returns {Object} { voices, loading, getVoicesForLanguage }
 */
export function useAvailableVoices() {
    const [voices, setVoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fonction pour charger les voix
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            setLoading(false);
        };

        // Charger immédiatement
        loadVoices();

        // Écouter le changement de voix (nécessaire sur certains navigateurs)
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    /**
     * Récupère les voix disponibles pour un code langue
     * @param {string} languageCode - Code langue (ex: "fr-FR", "fr", "en-US")
     * @returns {Array} Voix disponibles
     */
    const getVoicesForLanguage = (languageCode) => {
        const mainLang = languageCode.split("-")[0]; // "fr" de "fr-FR"

        return voices.filter((voice) => {
            // Vérifier correspondance exacte ou partielle
            return (
                voice.lang === languageCode ||
                voice.lang.startsWith(mainLang + "-") ||
                voice.lang === mainLang
            );
        });
    };

    /**
     * Vérifie si une langue est disponible
     * @param {string} languageCode - Code langue
     * @returns {boolean} true si au moins une voix disponible
     */
    const isLanguageAvailable = (languageCode) => {
        return getVoicesForLanguage(languageCode).length > 0;
    };

    return {
        voices,
        loading,
        getVoicesForLanguage,
        isLanguageAvailable,
    };
}
