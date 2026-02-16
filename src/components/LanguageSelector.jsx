import { AVAILABLE_LANGUAGES } from "../utils/languages";
import { useAvailableVoices } from "../hooks/useAvailableVoices";

/**
 * Sélecteur de langue pour les dictées
 * Affiche uniquement les langues disponibles sur le système
 */
function LanguageSelector({ value, onChange, disabled = false }) {
    const { loading, isLanguageAvailable } = useAvailableVoices();

    // Filtrer les langues disponibles
    const availableLanguages = AVAILABLE_LANGUAGES.map((lang) => ({
        ...lang,
        available: isLanguageAvailable(lang.code),
    }));

    const hasAvailableLanguages = availableLanguages.some(
        (lang) => lang.available
    );

    if (loading) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue de la dictée
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Détection des langues disponibles...
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue de la dictée
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {availableLanguages.map((lang) => (
                    <option
                        key={lang.code}
                        value={lang.code}
                        disabled={!lang.available}
                    >
                        {lang.flag} {lang.label}{" "}
                        {!lang.available ? "(non disponible)" : ""}
                    </option>
                ))}
            </select>

            {/* Message d'aide */}
            <p className="mt-2 text-xs text-gray-500">
                {hasAvailableLanguages ? (
                    <>
                        La synthèse vocale utilisera cette langue pour lire les
                        phrases.
                        {availableLanguages.filter((l) => !l.available).length >
                            0 && (
                            <span className="block mt-1 text-orange-600">
                                ⚠️ Certaines langues ne sont pas disponibles sur
                                votre navigateur.
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-orange-600">
                        ⚠️ Aucune voix de synthèse n'est disponible dans votre
                        navigateur.
                    </span>
                )}
            </p>

            {/* Liste des langues disponibles (détails) */}
            <details className="mt-2">
                <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                    Voir le détail des langues
                </summary>
                <ul className="mt-2 text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                    {availableLanguages.map((lang) => (
                        <li key={lang.code} className="flex items-center gap-2">
                            <span
                                className={
                                    lang.available
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {lang.available ? "✓" : "✗"}
                            </span>
                            <span>
                                {lang.flag} {lang.label} ({lang.code})
                            </span>
                        </li>
                    ))}
                </ul>
            </details>
        </div>
    );
}

export default LanguageSelector;
