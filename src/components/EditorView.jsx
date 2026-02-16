import { useState, useEffect } from "react";
import { getDictation, saveDictation } from "../services/storage";
import { createEmptyDictee } from "../domain/dictee";
import { validateDictation } from "../utils/validation";
import LanguageSelector from "./LanguageSelector";
import { DEFAULT_LANGUAGE } from "../utils/languages";

/**
 * Éditeur de dictée - Création et modification
 */
function EditorView({ dictationId, onBack, onSave }) {
    // Initialisation paresseuse pour éviter les rendus en cascade
    const [dictation, setDictation] = useState(() => {
        if (dictationId) {
            const existing = getDictation(dictationId);
            return existing || createEmptyDictee();
        }
        return createEmptyDictee();
    });

    const [rawSentences, setRawSentences] = useState(() => {
        if (dictationId) {
            const existing = getDictation(dictationId);
            return existing ? existing.sentences.join("\n") : "";
        }
        return "";
    });

    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = !!dictationId;

    // Vérification si la dictée existe (uniquement pour l'erreur)
    useEffect(() => {
        if (dictationId) {
            const existing = getDictation(dictationId);
            if (!existing) {
                console.error("Dictée non trouvée:", dictationId);
                onBack();
            }
        }
    }, [dictationId, onBack]);

    // Détection des changements (éviter de marquer comme modifié au premier rendu)
    useEffect(() => {
        // Ignorer le premier rendu
        const timer = setTimeout(() => setHasChanges(true), 100);
        return () => clearTimeout(timer);
    }, [dictation.title, dictation.language, rawSentences]);

    /**
     * Met à jour le titre
     */
    const handleTitleChange = (e) => {
        setDictation({ ...dictation, title: e.target.value });
        if (errors.title) {
            setErrors({ ...errors, title: null });
        }
    };

    /**
     * Met à jour la langue
     */
    const handleLanguageChange = (lang) => {
        setDictation({ ...dictation, language: lang });
        if (errors.language) {
            setErrors({ ...errors, language: null });
        }
    };

    /**
     * Met à jour les phrases
     */
    const handleSentencesChange = (e) => {
        setRawSentences(e.target.value);
        if (errors.sentences) {
            setErrors({ ...errors, sentences: null });
        }
    };

    /**
     * Sauvegarde la dictée
     */
    const handleSave = () => {
        setIsSaving(true);

        // Parser les phrases
        const sentences = rawSentences
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        // Créer la dictée complète
        const completeDictation = {
            ...dictation,
            sentences,
        };

        // Validation
        const validation = validateDictation(completeDictation);

        if (!validation.valid) {
            setErrors(validation.errors);
            setIsSaving(false);
            return;
        }

        // Sauvegarde
        try {
            const now = Date.now();
            const toSave = {
                ...completeDictation,
                updatedAt: now,
                createdAt: dictation.createdAt || now,
            };

            saveDictation(toSave);
            setHasChanges(false);

            // Callback optionnel
            if (onSave) {
                onSave(toSave);
            }

            // Retour après un court délai pour feedback visuel
            setTimeout(() => {
                onBack();
            }, 300);
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            setErrors({
                ...errors,
                global: error.message || "Erreur lors de la sauvegarde",
            });
            setIsSaving(false);
        }
    };

    /**
     * Annulation avec confirmation si changements
     */
    const handleCancel = () => {
        if (hasChanges) {
            if (
                window.confirm(
                    "Des modifications non enregistrées seront perdues. Continuer ?"
                )
            ) {
                onBack();
            }
        } else {
            onBack();
        }
    };

    return (
        <div className="view-container fade-in">
            <div className="max-w-3xl mx-auto">
                {/* En-tête */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode
                            ? "Modifier une dictée"
                            : "Créer une dictée"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEditMode
                            ? "Modifiez les informations de votre dictée"
                            : "Remplissez les informations pour créer votre dictée"}
                    </p>
                </div>

                {/* Erreur globale */}
                {errors.global && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{errors.global}</p>
                    </div>
                )}

                {/* Formulaire */}
                <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre de la dictée{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={dictation.title}
                            onChange={handleTitleChange}
                            placeholder="Ex: Les mois de l'année"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.title
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            maxLength={100}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {dictation.title.length}/100 caractères
                        </p>
                    </div>

                    {/* Langue */}
                    <div>
                        <LanguageSelector
                            value={dictation.language}
                            onChange={handleLanguageChange}
                        />
                        {errors.language && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.language}
                            </p>
                        )}
                    </div>

                    {/* Phrases */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phrases <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={rawSentences}
                            onChange={handleSentencesChange}
                            placeholder="Entrez une phrase par ligne&#10;Exemple:&#10;Le chat dort sur le canapé.&#10;Il fait beau aujourd'hui.&#10;Marie va à l'école."
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                                errors.sentences
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            rows={12}
                        />
                        {errors.sentences && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.sentences}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {
                                rawSentences
                                    .split("\n")
                                    .filter((s) => s.trim().length > 0).length
                            }{" "}
                            phrase(s) · Maximum 100 phrases · 500 caractères par
                            phrase
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
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
                                Enregistrement...
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
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                Enregistrer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditorView;
