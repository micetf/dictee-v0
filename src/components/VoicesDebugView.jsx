import { useAvailableVoices } from "../hooks/useAvailableVoices";
import { AVAILABLE_LANGUAGES } from "../utils/languages";

/**
 * Vue de débogage des voix disponibles
 * Utile pour l'enseignant pour vérifier la compatibilité
 */
function VoicesDebugView({ onBack }) {
    const { voices, loading } = useAvailableVoices();
    console.log("VoicesDebugView - voices:", voices);
    if (loading) {
        return (
            <div className="view-container fade-in">
                <p>Détection des voix...</p>
            </div>
        );
    }

    // Grouper les voix par langue principale
    const voicesByLang = {};
    voices.forEach((voice) => {
        const mainLang = voice.lang.split("-")[0];
        if (!voicesByLang[mainLang]) {
            voicesByLang[mainLang] = [];
        }
        voicesByLang[mainLang].push(voice);
    });

    return (
        <div className="view-container fade-in max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="mb-4 text-sm text-gray-600 hover:text-gray-900"
            >
                ← Retour
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                🔊 Voix de synthèse disponibles
            </h1>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                    <strong>ℹ️ Information :</strong> Cette page vous permet de
                    vérifier quelles langues sont disponibles sur votre
                    navigateur pour la lecture automatique des dictées.
                </p>
            </div>

            {/* Compatibilité avec les langues de l'app */}
            <div className="bg-white rounded-lg border p-4 mb-6">
                <h2 className="font-semibold text-gray-900 mb-3">
                    Langues supportées par l'application
                </h2>
                <div className="space-y-2">
                    {AVAILABLE_LANGUAGES.map((lang) => {
                        const available =
                            voicesByLang[lang.mainCode]?.length > 0;
                        return (
                            <div
                                key={lang.code}
                                className={`flex items-center justify-between p-2 rounded ${
                                    available ? "bg-green-50" : "bg-red-50"
                                }`}
                            >
                                <span className="text-sm">
                                    {lang.flag} {lang.label} ({lang.code})
                                </span>
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded ${
                                        available
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {available
                                        ? "✓ Disponible"
                                        : "✗ Non disponible"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Liste complète des voix */}
            <div className="bg-white rounded-lg border p-4">
                <h2 className="font-semibold text-gray-900 mb-3">
                    Toutes les voix détectées ({voices.length})
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">Langue</th>
                                <th className="px-3 py-2 text-left">Nom</th>
                                <th className="px-3 py-2 text-left">Local</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {voices.map((voice, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">{voice.lang}</td>
                                    <td className="px-3 py-2">{voice.name}</td>
                                    <td className="px-3 py-2">
                                        {voice.localService ? "✓" : "Cloud"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {voices.length === 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-orange-900">
                        ⚠️ Aucune voix détectée. Vérifiez que :
                    </p>
                    <ul className="list-disc list-inside text-sm text-orange-800 mt-2 space-y-1">
                        <li>
                            Vous utilisez un navigateur moderne (Chrome, Safari,
                            Edge)
                        </li>
                        <li>
                            La synthèse vocale n'est pas bloquée dans les
                            paramètres
                        </li>
                        <li>Des voix sont installées sur votre système</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default VoicesDebugView;
