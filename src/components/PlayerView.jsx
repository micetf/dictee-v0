import { useEffect, useState, startTransition } from "react";
import { getDictation } from "../services/storage";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { areTextsEqual } from "../utils/textComparison";
import ResultsView from "./ResultsView";

/**
 * Lecteur de dictée avec système d'étoiles et mastéry learning
 */
function PlayerView({ dictationId, onBack }) {
    const [dictation, setDictation] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [attempts, setAttempts] = useState([]); // Tentatives pour la phrase actuelle
    const [results, setResults] = useState([]); // Résultats de toutes les phrases
    const [showComparison, setShowComparison] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Charger la dictée
    useEffect(() => {
        if (!dictationId) return;

        const d = getDictation(dictationId);
        if (!d) {
            console.error("Dictée non trouvée:", dictationId);
            onBack();
            return;
        }

        // Regrouper tous les setState dans un seul batch
        const initialResults = d.sentences.map((sentence) => ({
            expected: sentence,
            attempts: [],
            stars: 0,
        }));

        // Utiliser startTransition pour éviter le warning
        startTransition(() => {
            setDictation(d);
            setResults(initialResults);
        });
    }, [dictationId, onBack]);

    const { supported, speaking, speak, cancel } = useSpeechSynthesis({
        language: dictation?.language || "fr-FR",
    });

    const totalSentences = dictation?.sentences.length || 0;
    const currentSentence = dictation?.sentences[currentIndex] || "";
    const attemptCount = attempts.length;
    const canPass = attemptCount >= 3;

    const handleListen = () => {
        if (!currentSentence) return;
        speak(currentSentence, dictation.language);
    };

    const handleValidate = () => {
        if (!inputValue.trim()) {
            alert("Écris quelque chose avant de valider !");
            return;
        }

        const isCorrect = areTextsEqual(inputValue, currentSentence);

        // Enregistrer la tentative
        const newAttempt = {
            text: inputValue.trim(),
            isCorrect,
            timestamp: Date.now(),
        };

        const updatedAttempts = [...attempts, newAttempt];
        setAttempts(updatedAttempts);
        setShowComparison(true);
        setIsValidated(true);

        if (isCorrect) {
            // Calcul des étoiles selon le nombre d'essais
            let stars = 0;
            if (updatedAttempts.length === 1) stars = 3;
            else if (updatedAttempts.length <= 3) stars = 2;
            else stars = 1;

            // Mettre à jour les résultats
            const updatedResults = [...results];
            updatedResults[currentIndex] = {
                ...updatedResults[currentIndex],
                attempts: updatedAttempts,
                stars,
            };
            setResults(updatedResults);
        }
    };

    const handleNext = () => {
        if (!isValidated) {
            alert("Valide d'abord ta réponse !");
            return;
        }

        const isCorrect = attempts.some((a) => a.isCorrect);

        if (!isCorrect) {
            alert("Tu dois écrire la phrase correctement avant de passer !");
            return;
        }

        // Passer à la phrase suivante
        if (currentIndex + 1 < totalSentences) {
            setCurrentIndex(currentIndex + 1);
            resetCurrentPhrase();
        } else {
            setCompleted(true);
            cancel();
        }
    };

    const handlePass = () => {
        if (!canPass) return;

        // Enregistrer sans étoiles
        const updatedResults = [...results];
        updatedResults[currentIndex] = {
            ...updatedResults[currentIndex],
            attempts,
            stars: 0,
        };
        setResults(updatedResults);

        // Passer à la phrase suivante
        if (currentIndex + 1 < totalSentences) {
            setCurrentIndex(currentIndex + 1);
            resetCurrentPhrase();
        } else {
            setCompleted(true);
            cancel();
        }
    };

    const resetCurrentPhrase = () => {
        setInputValue("");
        setAttempts([]);
        setShowComparison(false);
        setIsValidated(false);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setCompleted(false);
        setResults(
            dictation.sentences.map((sentence) => ({
                expected: sentence,
                attempts: [],
                stars: 0,
            }))
        );
        resetCurrentPhrase();
    };

    if (!dictation) {
        return (
            <div className="view-container fade-in">
                <p>Chargement...</p>
            </div>
        );
    }

    if (completed) {
        return (
            <ResultsView
                dictation={dictation}
                results={results}
                onRestart={handleRestart}
                onBack={onBack}
            />
        );
    }

    const isCorrect = attempts.some((a) => a.isCorrect);

    return (
        <div className="view-container fade-in max-w-2xl mx-auto">
            {/* En-tête */}
            <div className="mb-4">
                <button
                    className="mb-2 text-sm text-gray-600 hover:text-gray-900"
                    onClick={onBack}
                >
                    ← Retour
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {dictation.title}
                </h1>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                    <span>
                        Phrase {currentIndex + 1} sur {totalSentences}
                    </span>
                    <span>Essai {attemptCount + 1}</span>
                </div>
            </div>

            {/* Zone de travail */}
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                {/* Bouton écoute */}
                <div>
                    <button
                        onClick={handleListen}
                        disabled={!supported || speaking}
                        className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 text-lg flex items-center justify-center gap-3"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828 2.828a9 9 0 0012.728 0M4.464 19.536a9 9 0 010-12.728"
                            />
                        </svg>
                        Écouter la phrase
                    </button>
                </div>

                {/* Saisie */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Écris la phrase :
                    </label>
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isCorrect}
                        placeholder="Écris ici ce que tu entends..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                        rows={3}
                    />
                </div>

                {/* Bouton validation */}
                {!isCorrect && (
                    <button
                        onClick={handleValidate}
                        disabled={!inputValue.trim() || isValidated}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Valider ma phrase
                    </button>
                )}

                {/* Comparaison */}
                {showComparison && (
                    <div
                        className={`rounded-lg p-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"}`}
                    >
                        {isCorrect ? (
                            <>
                                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                                    <svg
                                        className="w-6 h-6"
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
                                    Bravo ! C'est juste !
                                </div>
                                <div className="text-sm text-green-600">
                                    {"⭐".repeat(
                                        attemptCount === 1
                                            ? 3
                                            : attemptCount <= 3
                                              ? 2
                                              : 1
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-orange-700 font-semibold mb-3">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Pas tout à fait... Compare bien :
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-600 font-semibold flex-shrink-0">
                                            ❌ Ta réponse :
                                        </span>
                                        <span className="text-gray-800">
                                            {inputValue}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-semibold flex-shrink-0">
                                            ✅ Attendu :
                                        </span>
                                        <span className="text-gray-800">
                                            {currentSentence}
                                        </span>
                                    </div>
                                </div>

                                {attemptCount === 1 && (
                                    <p className="mt-3 text-sm text-orange-700">
                                        💡 Regarde bien les différences et
                                        réessaie !
                                    </p>
                                )}
                                {attemptCount === 2 && (
                                    <p className="mt-3 text-sm text-orange-700">
                                        💪 Courage, tu es proche du bon résultat
                                        !
                                    </p>
                                )}
                                {attemptCount >= 3 && (
                                    <p className="mt-3 text-sm text-orange-700">
                                        🤔 Tu peux demander de l'aide ou passer
                                        à la phrase suivante.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                    {!isCorrect && isValidated && (
                        <button
                            onClick={() => {
                                setInputValue("");
                                setIsValidated(false);
                                setShowComparison(false);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Réessayer
                        </button>
                    )}

                    {canPass && !isCorrect && (
                        <button
                            onClick={handlePass}
                            className="flex-1 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50"
                        >
                            Passer cette phrase
                        </button>
                    )}

                    {isCorrect && (
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                        >
                            {currentIndex + 1 < totalSentences
                                ? "Phrase suivante →"
                                : "Voir mes résultats"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlayerView;
