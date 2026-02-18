import { useState } from "react";
import {
    listDictations,
    deleteDictation,
    resetToDefaultDictations,
    duplicateDictation,
} from "../services/storage";
import DictationCard from "./DictationCard";
import { generateMarkdown } from "../services/markdown";
import { downloadTextFile, sanitizeFilename } from "../utils/download";
import ImportMarkdownModal from "./ImportMarkdownModal";
import ImportCloudModal from "./ImportCloudModal";
import MigrateLegacyModal from "./MigrateLegacyModal";

/**
 * Page d'accueil de l'enseignant - Bibliothèque de dictées
 */
function TeacherHome({ onCreateNew, onEdit, onPlay, onBack, onNavigate }) {
    // Initialisation paresseuse : charger les dictées uniquement au premier rendu
    const [dictations, setDictations] = useState(() => {
        const all = listDictations();
        return all.sort((a, b) => b.updatedAt - a.updatedAt);
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImportCloudModalOpen, setIsImportCloudModalOpen] = useState(false);
    const [isMigrateLegacyModalOpen, setIsMigrateLegacyModalOpen] =
        useState(false);

    // Fonction de rafraîchissement (pour après suppression/modification)
    const refreshDictations = () => {
        const all = listDictations();
        const sorted = all.sort((a, b) => b.updatedAt - a.updatedAt);
        setDictations(sorted);
    };

    const handleDelete = (id) => {
        deleteDictation(id);
        refreshDictations();
    };

    const handleReset = () => {
        const success = resetToDefaultDictations();
        if (success) {
            refreshDictations();
        }
    };

    const handleDuplicate = (id) => {
        const newId = duplicateDictation(id);
        if (newId) {
            refreshDictations();
        }
    };

    // Filtrage par recherche
    const filteredDictations = dictations.filter((d) => {
        const query = searchQuery.toLowerCase();
        return (
            d.title.toLowerCase().includes(query) ||
            d.language.toLowerCase().includes(query) ||
            d.sentences.some((s) => s.toLowerCase().includes(query))
        );
    });
    const handleExport = (dictation) => {
        try {
            const markdown = generateMarkdown(dictation);
            const filename = `${sanitizeFilename(dictation.title) || "dictee"}.md`;
            downloadTextFile(markdown, filename);
        } catch (error) {
            console.error("Erreur export:", error);
            alert("Erreur lors de l'export : " + error.message);
        }
    };

    const handleExportAll = () => {
        if (dictations.length === 0) {
            alert("Aucune dictée à exporter");
            return;
        }
        dictations.forEach((d) => handleExport(d));
    };

    return (
        <div className="view-container fade-in">
            {/* En-tête */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bibliothèque de dictées
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {dictations.length} dictée
                            {dictations.length > 1 ? "s" : ""} enregistrée
                            {dictations.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    <button
                        onClick={onBack}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ← Retour à l'accueil
                    </button>
                </div>
            </div>

            {/* Barre d'actions */}
            <div className="mb-6 space-y-4">
                {/* Actions principales */}
                <button
                    onClick={() => onNavigate && onNavigate("voices-debug")}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                    title="Vérifier les langues disponibles sur ce navigateur"
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="hidden sm:inline">
                        Langues disponibles
                    </span>
                    <span className="sm:hidden">Langues</span>
                </button>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={onCreateNew}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors flex items-center gap-2"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Nouvelle dictée
                    </button>

                    {/* Boutons import  */}
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Importer un fichier
                    </button>

                    <button
                        onClick={() => setIsImportCloudModalOpen(true)}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Importer depuis le cloud
                    </button>

                    <button
                        onClick={() => setIsMigrateLegacyModalOpen(true)}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Migrer ancien lien
                    </button>

                    <button
                        onClick={handleExportAll}
                        disabled={dictations.length === 0}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                            dictations.length === 0
                                ? "Aucune dictée à exporter"
                                : "Exporter toutes les dictées"
                        }
                    >
                        Tout exporter
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 border border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg text-sm flex items-center gap-2"
                        title="Réinitialiser avec les dictées par défaut"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Réinitialiser
                    </button>
                </div>

                {/* Barre de recherche */}
                {dictations.length > 0 && (
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Rechercher une dictée..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Liste des dictées */}
            {filteredDictations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    {searchQuery ? (
                        <>
                            <svg
                                className="mx-auto w-16 h-16 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <p className="text-gray-600 text-lg mb-2">
                                Aucune dictée ne correspond à votre recherche
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-blue-600 hover:underline"
                            >
                                Effacer la recherche
                            </button>
                        </>
                    ) : (
                        <>
                            <svg
                                className="mx-auto w-16 h-16 text-gray-400 mb-4"
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
                            <p className="text-gray-600 text-lg mb-2">
                                Aucune dictée pour l'instant
                            </p>
                            <p className="text-gray-500 mb-4">
                                Commencez par créer votre première dictée
                            </p>
                            <button
                                onClick={onCreateNew}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors inline-flex items-center gap-2"
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
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Créer ma première dictée
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredDictations.map((dictation) => (
                        <DictationCard
                            key={dictation.id}
                            dictation={dictation}
                            onEdit={onEdit}
                            onPlay={onPlay}
                            onDelete={handleDelete}
                            onExport={handleExport}
                            onDuplicate={handleDuplicate}
                        />
                    ))}
                </div>
            )}
            {/* Modal d'import */}
            <ImportMarkdownModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => {
                    refreshDictations();
                }}
            />
            {/* Modal import cloud */}
            <ImportCloudModal
                isOpen={isImportCloudModalOpen}
                onClose={() => setIsImportCloudModalOpen(false)}
                onSuccess={() => {
                    refreshDictations();
                }}
            />
            {/* Modal migration legacy */}
            <MigrateLegacyModal
                isOpen={isMigrateLegacyModalOpen}
                onClose={() => setIsMigrateLegacyModalOpen(false)}
                onSuccess={() => {
                    refreshDictations();
                }}
            />
        </div>
    );
}

export default TeacherHome;
