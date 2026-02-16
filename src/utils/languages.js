/**
 * Configuration des langues pour la synthèse vocale
 */

export const AVAILABLE_LANGUAGES = [
    {
        code: "fr-FR",
        mainCode: "fr",
        label: "Français",
        flag: "🇫🇷",
    },
    {
        code: "en-US",
        mainCode: "en",
        label: "Anglais",
        flag: "🇬🇧",
    },
    {
        code: "es-ES",
        mainCode: "es",
        label: "Espagnol",
        flag: "🇪🇸",
    },
    {
        code: "de-DE",
        mainCode: "de",
        label: "Allemand",
        flag: "🇩🇪",
    },
    {
        code: "it-IT",
        mainCode: "it",
        label: "Italien",
        flag: "🇮🇹",
    },
];

export const DEFAULT_LANGUAGE = "fr-FR";

/**
 * Trouve la langue par code
 * @param {string} code - Code langue (ex: "fr-FR")
 * @returns {Object|undefined} Objet langue
 */
export function getLanguageByCode(code) {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Obtient le label d'une langue
 * @param {string} code - Code langue
 * @returns {string} Label de la langue
 */
export function getLanguageLabel(code) {
    const lang = getLanguageByCode(code);
    return lang ? `${lang.flag} ${lang.label}` : code;
}
