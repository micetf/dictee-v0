import { useState } from "react";
import {
    fetchMarkdownFromCloud,
    getCloudServiceInfo,
} from "../services/cloudImport";
import { parseMarkdown } from "../services/markdown";
import { saveDictation } from "../services/storage";
import { createEmptyDictee } from "../domain/dictee";

/**
 * Modal d'import depuis un service cloud
 */
function ImportCloudModal({ isOpen, onClose, onSuccess }) {
    const [url, setUrl] = useState("");
    const [preview, setPreview] = useState(null);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    if (!isOpen) return null;

    const handleUrlChange = (e) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setError(null);
        setPreview(null);
        setServiceInfo(null);

        // Détection automatique du service si URL complète
        if (newUrl.trim().length > 10 && newUrl.includes("://")) {
            try {
                const info = getCloudServiceInfo(newUrl.trim());
                setServiceInfo(info);
            } catch (err) {
                console.log(err); // Silencieux, pas grave si détection échoue
            }
        }
    };

    const handleFetch = async () => {
        if (!url.trim()) {
            setError("Veuillez saisir une URL");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPreview(null);

        try {
            // Fetch le contenu
            const content = await fetchMarkdownFromCloud(url.trim());

            // Parser le markdown
            const parsed = parseMarkdown(content);
            setPreview(parsed);
        } catch (err) {
            setError(err.message);
            setPreview(null);
        } finally {
            setIsLoading(false);
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
        setServiceInfo(null);
        setError(null);
        setIsLoading(false);
        setIsImporting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Importer depuis le cloud
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        CodiMD, HedgeDoc, Dropbox, Google Drive (liens publics)
                    </p>
                </div>

                {/* Contenu */}
                <div className="px-6 py-4 space-y-4">
                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien de partage
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={handleUrlChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleFetch();
                                }
                            }}
                            placeholder="https://codimd.example.com/s/abc123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {serviceInfo && (
                            <p className="mt-1 text-xs text-gray-600">
                                Service détecté :{" "}
                                <strong>{serviceInfo.serviceLabel}</strong>
                            </p>
                        )}
                    </div>

                    {/* Bouton de récupération */}
                    <div>
                        <button
                            onClick={handleFetch}
                            disabled={isLoading || !url.trim()}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Récupération en cours...
                                </>
                            ) : (
                                <>
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
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                        />
                                    </svg>
                                    Récupérer la dictée
                                </>
                            )}
                        </button>
                        <p className="mt-1 text-xs text-gray-500">
                            Appuyez sur Entrée ou cliquez sur le bouton
                        </p>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            <p className="font-semibold mb-1">Erreur</p>
                            <p>{error}</p>
                            {error.includes("CORS") && (
                                <details className="mt-2 text-xs">
                                    <summary className="cursor-pointer text-red-700 hover:underline">
                                        Que faire ?
                                    </summary>
                                    <ul className="mt-1 list-disc pl-4 space-y-1">
                                        <li>Vérifiez que le lien est public</li>
                                        <li>
                                            Utilisez un lien CodiMD/HedgeDoc
                                            (meilleur support CORS)
                                        </li>
                                        <li>
                                            Ou téléchargez le fichier et
                                            utilisez l'import local
                                        </li>
                                    </ul>
                                </details>
                            )}
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
                                        Dictée récupérée avec succès
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
                                        Voir les phrases
                                    </summary>
                                    <ul className="mt-2 space-y-1 pl-4 text-xs">
                                        {preview.sentences.map((s, i) => (
                                            <li key={i}>
                                                {i + 1}. {s}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        </div>
                    )}

                    {/* Aide */}
                    <details className="text-xs text-gray-600">
                        <summary className="cursor-pointer hover:text-gray-800 font-medium">
                            Services cloud supportés
                        </summary>
                        <ul className="mt-2 space-y-2 pl-4">
                            <li>
                                <strong>CodiMD / HedgeDoc :</strong> Collez le
                                lien de partage (ex:
                                https://codimd.example.com/s/abc123)
                            </li>
                            <li>
                                <strong>Dropbox :</strong> Générez un lien de
                                partage public
                            </li>
                            <li>
                                <strong>Google Drive :</strong> Définissez le
                                fichier en "Accès public" et copiez le lien
                            </li>
                            <li>
                                <strong>Lien direct :</strong> URL directe vers
                                un fichier .md hébergé
                            </li>
                        </ul>
                    </details>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isImporting || isLoading}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!preview || isImporting || isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isImporting ? "Import en cours..." : "Importer"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImportCloudModal;
