import { useState } from "react";
import { parseLegacyUrl, isLegacyUrl } from "../services/legacyImport";
import { saveDictation } from "../services/storage";
import { createEmptyDictee } from "../domain/dictee";

/**
 * Modal de migration des anciennes dictées micetf.fr/dictee
 */
function MigrateLegacyModal({ isOpen, onClose, onSuccess }) {
    const [url, setUrl] = useState("");
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    if (!isOpen) return null;

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setError(null);
        setPreview(null);
    };

    const handleParse = () => {
        if (!url.trim()) {
            setError("Veuillez coller une URL");
            return;
        }

        try {
            const parsed = parseLegacyUrl(url.trim());
            setPreview(parsed);
            setError(null);
        } catch (err) {
            setError(err.message);
            setPreview(null);
        }
    };

    const handleImport = () => {
        if (!preview) return;

        setIsImporting(true);

        try {
            const newDictation = {
                ...createEmptyDictee(),
                ...preview,
            };
            saveDictation(newDictation);

            if (onSuccess) {
                onSuccess(newDictation);
            }

            handleClose();
        } catch (err) {
            setError("Erreur lors de l'import : " + err.message);
            setIsImporting(false);
        }
    };

    const handleClose = () => {
        setUrl("");
        setPreview(null);
        setError(null);
        setIsImporting(false);
        onClose();
    };

    // Détection automatique
    const isLegacy = url.trim().length > 10 && isLegacyUrl(url.trim());

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Migrer une ancienne dictée
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        micetf.fr/dictee (format URL avec codes ASCII)
                    </p>
                </div>

                {/* Contenu */}
                <div className="px-6 py-4 space-y-4">
                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien de l'ancienne dictée
                        </label>
                        <textarea
                            value={url}
                            onChange={handleUrlChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                    handleParse();
                                }
                            }}
                            placeholder="<https://micetf.fr/dictee/?tl=fr&titre=Ma+dictée&d>[1]=66|111|110|106|111|117|114&d[2]=..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                            rows={4}
                        />
                        {isLegacy && (
                            <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Format legacy détecté
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Ctrl+Entrée pour analyser
                        </p>
                    </div>

                    {/* Bouton d'analyse */}
                    <div>
                        <button
                            onClick={handleParse}
                            disabled={!url.trim()}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Analyser l'URL
                        </button>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            <p className="font-semibold mb-1">Erreur</p>
                            <p>{error}</p>
                            <details className="mt-2 text-xs">
                                <summary className="cursor-pointer text-red-700 hover:underline">
                                    Format attendu
                                </summary>
                                <div className="mt-2 space-y-1">
                                    <p>L'URL doit contenir :</p>
                                    <ul className="list-disc pl-4">
                                        <li>
                                            <code>tl=fr</code> ou{" "}
                                            <code>lang=fr</code> (langue)
                                        </li>
                                        <li>
                                            <code>titre=Mon+titre</code> (titre
                                            URL-encodé)
                                        </li>
                                        <li>
                                            <code>d[1]=66|111|110...</code>{" "}
                                            (phrases en codes ASCII)
                                        </li>
                                    </ul>
                                    <p className="mt-2">
                                        Exemple :{" "}
                                        <code className="text-xs break-all">
                                            ?tl=fr&titre=Test&d[1]=66|111|110|106|111|117|114
                                        </code>
                                    </p>
                                </div>
                            </details>
                        </div>
                    )}

                    {/* Aperçu */}
                    {preview && (
                        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                            <div className="flex items-start gap-2 mb-2">
                                <svg
                                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-green-900">
                                        Dictée décodée avec succès
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm text-green-900 pl-7">
                                <p>
                                    <strong>Titre :</strong> {preview.title}
                                </p>
                                <p>
                                    <strong>Langue :</strong> {preview.language}
                                </p>
                                <p>
                                    <strong>Phrases :</strong>{" "}
                                    {preview.sentences.length}
                                </p>
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-green-700 hover:underline">
                                        Voir les phrases décodées
                                    </summary>
                                    <ul className="mt-2 space-y-1 pl-4 text-xs max-h-48 overflow-y-auto">
                                        {preview.sentences.map((s, i) => (
                                            <li
                                                key={i}
                                                className="border-b border-green-200 pb-1"
                                            >
                                                {i + 1}. {s}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        </div>
                    )}

                    {/* Exemple */}
                    <details className="text-xs text-gray-600">
                        <summary className="cursor-pointer hover:text-gray-800 font-medium">
                            Où trouver mes anciennes dictées ?
                        </summary>
                        <div className="mt-2 space-y-2 pl-2">
                            <p>
                                Si vous avez créé des dictées sur{" "}
                                <strong>micetf.fr/dictee</strong>, vous avez
                                peut-être sauvegardé les liens.
                            </p>
                            <p>Le format ressemble à :</p>
                            <code className="block bg-gray-100 p-2 rounded text-xs break-all">
                                https://micetf.fr/dictee/?tl=fr&titre=Les+mois+de+l%27ann%C3%A9e&d[1]=106|97|110|118|105|101|114|&d[2]=102|233|118|114...
                            </code>
                            <p className="text-red-600 text-xs mt-2">
                                ⚠️ Les anciennes dictées non sauvegardées ne
                                peuvent pas être récupérées.
                            </p>
                        </div>
                    </details>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isImporting}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!preview || isImporting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isImporting
                            ? "Import en cours..."
                            : "Importer la dictée"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MigrateLegacyModal;
