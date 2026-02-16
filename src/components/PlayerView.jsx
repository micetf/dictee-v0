import { useEffect, useState, useMemo } from "react";
import { getDictation } from "../services/storage";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

/**
 * Composant de lecture de dictée pour un élève
 * - Lecture phrase par phrase
 * - Saisie de la réponse
 * - Correction simple : exact / différent
 *
 * Note: Utiliser une key={dictationId} sur ce composant pour réinitialiser
 * automatiquement l'état lors du changement de dictée
 */
function PlayerView({ dictationId, onBack }) {
    // Charger la dictée directement via useMemo
    const dictation = useMemo(() => {
        if (!dictationId) return null;
        const d = getDictation(dictationId);
        if (!d) {
            console.error("Dictée non trouvée pour le lecteur:", dictationId);
            return null;
        }
        return d;
    }, [dictationId]);

    // États initialisés une seule fois (le composant sera remonté via key)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [showText, setShowText] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Hook de synthèse vocale
    const { supported, speaking, error, speak, cancel } = useSpeechSynthesis({
        language: dictation?.language || "fr-FR",
    });

    // Rediriger si dictée non trouvée (une seule fois au montage)
    useEffect(() => {
        if (!dictation) {
            onBack();
        }
    }, [dictation, onBack]);

    const totalSentences = dictation?.sentences.length || 0;

    const currentSentence = useMemo(() => {
        if (!dictation || currentIndex < 0 || currentIndex >= totalSentences) {
            return "";
        }
        return dictation.sentences[currentIndex];
    }, [dictation, currentIndex, totalSentences]);

    const progressLabel = useMemo(() => {
        if (!dictation) return "";
        return `Phrase ${currentIndex + 1} sur ${totalSentences}`;
    }, [currentIndex, totalSentences, dictation]);

    const handleListen = () => {
        if (!currentSentence) return;
        speak(currentSentence, dictation.language);
    };

    const handleCheck = () => {
        if (!currentSentence) return;
        const expected = normalizeText(currentSentence);
        const given = normalizeText(inputValue);

        if (given.length === 0) {
            setFeedback(null);
            return;
        }

        if (expected === given) {
            setFeedback("correct");
        } else {
            setFeedback("incorrect");
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < totalSentences) {
            setCurrentIndex(currentIndex + 1);
            setInputValue("");
            setFeedback(null);
            setShowText(false);
            cancel();
        } else {
            setCompleted(true);
            cancel();
        }
    };

    const handlePrevious = () => {
        if (currentIndex === 0) return;
        setCurrentIndex(currentIndex - 1);
        setInputValue("");
        setFeedback(null);
        setShowText(false);
        cancel();
    };

    const handleReveal = () => {
        setShowText(true);
        setFeedback(null);
    };

    const handleRestart = () => {
        setCompleted(false);
        setCurrentIndex(0);
        setInputValue("");
        setFeedback(null);
        setShowText(false);
    };

    if (!dictation) {
        return (
            <div className="view-container fade-in">
                <p>Chargement de la dictée...</p>
            </div>
        );
    }

    if (completed) {
        return (
            <div className="view-container fade-in max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Dictée terminée
                </h1>
                <p className="text-gray-700 mb-6">
                    Tu as terminé la dictée « {dictation.title || "Sans titre"}{" "}
                    ».
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                        onClick={handleRestart}
                    >
                        Recommencer la dictée
                    </button>
                    <button
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        onClick={onBack}
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-container fade-in max-w-2xl mx-auto">
            {/* En-tête */}
            <div className="mb-4 flex flex-col gap-1">
                <button
                    className="mb-2 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                    onClick={onBack}
                >
                    ← Retour
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dictée : {dictation.title || "Sans titre"}
                </h1>
                <p className="text-sm text-gray-600">{progressLabel}</p>
                <p className="text-xs text-gray-500">
                    Langue : {dictation.language}{" "}
                    {supported ? "" : "(lecture vocale non disponible)"}
                </p>
            </div>

            {/* Zone de travail */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-4">
                {/* Boutons de contrôle */}
                <div className="flex flex-wrap gap-2">
                    <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        onClick={handleListen}
                        disabled={!supported || speaking}
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
                                d="M9 19V5l7 7-7 7z"
                            />
                        </svg>
                        Écouter la phrase
                    </button>

                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        onClick={handleReveal}
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        Afficher la phrase
                    </button>

                    {speaking && (
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            onClick={cancel}
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Arrêter
                        </button>
                    )}
                </div>

                {/* Affichage de la phrase (optionnel, pour soutien) */}
                {showText && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded text-gray-800 text-sm">
                        {currentSentence}
                    </div>
                )}

                {/* Zone de saisie */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ta phrase
                    </label>
                    <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        rows={3}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleCheck}
                        placeholder="Écris ici ce que tu entends"
                    />
                    {/* Feedback */}
                    {feedback === "correct" && (
                        <p className="mt-2 text-sm text-green-700">
                            Bravo, c'est exactement la même phrase.
                        </p>
                    )}
                    {feedback === "incorrect" && (
                        <p className="mt-2 text-sm text-orange-700">
                            Ta phrase est différente. Tu peux écouter à nouveau
                            ou afficher la phrase.
                        </p>
                    )}
                </div>

                {/* Message d'erreur synthèse vocale */}
                {error && <p className="text-xs text-red-600">{error}</p>}

                {/* Navigation entre phrases */}
                <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            ← Précédente
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleNext}
                            disabled={totalSentences === 0}
                        >
                            {currentIndex + 1 < totalSentences
                                ? "Phrase suivante →"
                                : "Terminer la dictée"}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500">{progressLabel}</p>
                </div>
            </div>
        </div>
    );
}

/**
 * Normalise un texte pour comparaison simple
 */
function normalizeText(text) {
    return text.toLowerCase().trim().replace(/\s+/g, " ");
}

export default PlayerView;
