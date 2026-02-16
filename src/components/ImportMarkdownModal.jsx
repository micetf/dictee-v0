import { useState } from "react";
import { parseMarkdown } from "../services/markdown";
import { saveDictation } from "../services/storage";
import { createEmptyDictee } from "../domain/dictee";

/**
 * Modal d'import de fichier markdown
 */
function ImportMarkdownModal({ isOpen, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError(null);
        setPreview(null);

        // Vérifier l'extension
        if (!selectedFile.name.endsWith(".md")) {
            setError("Le fichier doit avoir l'extension .md");
            return;
        }

        // Lire et parser le fichier
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const parsed = parseMarkdown(content);
                setPreview(parsed);
            } catch (err) {
                setError(err.message);
                setPreview(null);
            }
        };
        reader.onerror = () => {
            setError("Erreur lors de la lecture du fichier");
        };
        reader.readAsText(selectedFile);
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
        setFile(null);
        setPreview(null);
        setError(null);
        setIsImporting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Importer un fichier Markdown
                    </h2>
                </div>

                {/* Contenu */}
                <div className="px-6 py-4 space-y-4">
                    {/* Sélection de fichier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sélectionner un fichier .md
                        </label>
                        <input
                            type="file"
                            accept=".md"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Fichier sélectionné :{" "}
                                <strong>{file.name}</strong>
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Format : voir{" "}
                            <a
                                href="/docs/FORMAT_MARKDOWN.md"
                                target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                                documentation
                            </a>
                        </p>
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {/* Aperçu */}
                    {preview && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Aperçu de la dictée
                            </h3>
                            <div className="space-y-2 text-sm">
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
                                    <summary className="cursor-pointer text-blue-600 hover:underline">
                                        Voir les phrases
                                    </summary>
                                    <ul className="mt-2 space-y-1 pl-4 text-xs text-gray-700">
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
                        {isImporting ? "Import en cours..." : "Importer"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImportMarkdownModal;
