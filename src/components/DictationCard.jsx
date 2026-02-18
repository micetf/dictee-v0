import { useState } from "react";
import { formatRelativeDate } from "../utils/date";
import ShareModal from "./ShareModal";
/**
 * Carte affichant une dictée dans la bibliothèque
 * @param {Object} dictation - Dictée à afficher
 * @param {Function} onEdit - Callback pour éditer
 * @param {Function} onPlay - Callback pour jouer
 * @param {Function} onDelete - Callback pour supprimer
 */
function DictationCard({ dictation, onEdit, onPlay, onDelete, onExport }) {
    const [showShareModal, setShowShareModal] = useState(false);
    const handleDelete = () => {
        if (
            window.confirm(
                `Supprimer la dictée "${dictation.title || "Sans titre"}" ?`
            )
        ) {
            onDelete(dictation.id);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                {/* Informations dictée */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {dictation.title || "Sans titre"}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
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
                                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                />
                            </svg>
                            {dictation.language}
                        </span>

                        <span className="inline-flex items-center gap-1">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            {dictation.sentences.length} phrase
                            {dictation.sentences.length > 1 ? "s" : ""}
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                        Modifiée {formatRelativeDate(dictation.updatedAt)}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                    <button
                        onClick={() => onPlay(dictation.id)}
                        className="flex-1 md:flex-none px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                        title="Jouer la dictée"
                    >
                        <span className="hidden md:inline">Jouer</span>
                        <svg
                            className="w-5 h-5 md:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="flex-1 px-3 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 rounded text-sm font-semibold flex items-center justify-center gap-1"
                        title="Partager cette dictée"
                    >
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
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                        </svg>
                        Partager
                    </button>
                    {showShareModal && (
                        <ShareModal
                            dictation={dictation}
                            onClose={() => setShowShareModal(false)}
                        />
                    )}
                    <button
                        onClick={() => onEdit(dictation.id)}
                        className="flex-1 md:flex-none px-3 py-2 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded font-medium transition-colors"
                        title="Modifier la dictée"
                    >
                        <span className="hidden md:inline">Modifier</span>
                        <svg
                            className="w-5 h-5 md:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 md:flex-none px-3 py-2 text-sm border border-red-600 text-red-600 hover:bg-red-50 rounded font-medium transition-colors"
                        title="Supprimer la dictée"
                    >
                        <span className="hidden md:inline">Supprimer</span>
                        <svg
                            className="w-5 h-5 md:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => onExport(dictation)}
                        className="flex-1 md:flex-none px-3 py-2 text-sm border border-gray-600 text-gray-600 hover:bg-gray-50 rounded font-medium transition-colors"
                        title="Exporter en .md"
                    >
                        <span className="hidden md:inline">Exporter</span>
                        <svg
                            className="w-5 h-5 md:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {showShareModal && (
                <ShareModal
                    dictation={dictation}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
}

export default DictationCard;
