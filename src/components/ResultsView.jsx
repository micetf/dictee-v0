import { useState } from "react";

/**
 * Écran de résultats final avec système d'étoiles
 */
function ResultsView({ dictation, results, onRestart, onBack }) {
    const [showPrintOptions, setShowPrintOptions] = useState(false);
    const [printOptions, setPrintOptions] = useState({
        studentName: "",
        teacherName: "",
        className: "",
        showAttempts: false, // Par défaut désactivé pour gagner de la place
    });

    const totalStars = results.reduce((sum, r) => sum + r.stars, 0);
    const maxStars = results.length * 3;
    const percentage = Math.round((totalStars / maxStars) * 100);

    const star3Count = results.filter((r) => r.stars === 3).length;
    const star2Count = results.filter((r) => r.stars === 2).length;
    const star1Count = results.filter((r) => r.stars === 1).length;
    const star0Count = results.filter((r) => r.stars === 0).length;

    const handlePrint = () => {
        window.print();
    };

    const handlePrintWithOptions = () => {
        setShowPrintOptions(true);
    };

    const handleConfirmPrint = () => {
        setShowPrintOptions(false);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    return (
        <div className="view-container fade-in max-w-3xl mx-auto">
            {/* Zone imprimable */}
            <div className="printable-area">
                {/* En-tête compact (visible uniquement à l'impression) */}
                <div className="hidden print:block mb-2 pb-2 border-b border-gray-800">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-base font-bold leading-tight">
                                Dictée : {dictation.title}
                            </h1>
                            {(printOptions.studentName ||
                                printOptions.className) && (
                                <div className="text-xs mt-1">
                                    {printOptions.studentName && (
                                        <span className="mr-3">
                                            Élève : {printOptions.studentName}
                                        </span>
                                    )}
                                    {printOptions.className && (
                                        <span className="mr-3">
                                            Classe : {printOptions.className}
                                        </span>
                                    )}
                                    {printOptions.teacherName && (
                                        <span>
                                            Enseignant :{" "}
                                            {printOptions.teacherName}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-right">
                            <p>{new Date().toLocaleDateString("fr-FR")}</p>
                        </div>
                    </div>
                </div>

                {/* En-tête écran (masqué à l'impression) */}
                <div className="print:hidden text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dictée terminée !
                    </h1>
                    <p className="text-gray-600">{dictation.title}</p>
                </div>

                {/* Score principal - version compacte pour impression */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 print:p-2 mb-4 print:mb-2 text-center border border-blue-200 print-keep-together">
                    <div className="flex items-center justify-center gap-4 print:gap-2">
                        <div>
                            <div className="text-4xl print:text-2xl font-bold text-blue-600">
                                {totalStars}/{maxStars}
                            </div>
                            <div className="text-sm print:text-xs text-gray-700">
                                étoiles
                            </div>
                        </div>
                        <div className="text-3xl print:text-xl font-bold text-gray-700">
                            {percentage}%
                        </div>
                    </div>
                </div>

                {/* Répartition compacte */}
                <div className="grid grid-cols-4 gap-2 print:gap-1 mb-4 print:mb-2 print-keep-together">
                    <div className="bg-green-50 rounded p-2 print:p-1 text-center border border-green-300">
                        <div className="text-lg print:text-sm">⭐⭐⭐</div>
                        <div className="text-xl print:text-base font-bold text-green-600">
                            {star3Count}
                        </div>
                        <div className="text-xs print:text-[7pt] text-gray-600">
                            1er coup
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded p-2 print:p-1 text-center border border-blue-300">
                        <div className="text-lg print:text-sm">⭐⭐</div>
                        <div className="text-xl print:text-base font-bold text-blue-600">
                            {star2Count}
                        </div>
                        <div className="text-xs print:text-[7pt] text-gray-600">
                            2-3 essais
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded p-2 print:p-1 text-center border border-orange-300">
                        <div className="text-lg print:text-sm">⭐</div>
                        <div className="text-xl print:text-base font-bold text-orange-600">
                            {star1Count}
                        </div>
                        <div className="text-xs print:text-[7pt] text-gray-600">
                            3+ essais
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded p-2 print:p-1 text-center border border-gray-300">
                        <div className="text-lg print:text-sm">-</div>
                        <div className="text-xl print:text-base font-bold text-gray-600">
                            {star0Count}
                        </div>
                        <div className="text-xs print:text-[7pt] text-gray-600">
                            Passés
                        </div>
                    </div>
                </div>

                {/* Détail par phrase - ultra compact */}
                <div className="bg-white rounded-lg border border-gray-300 p-3 print:p-2 mb-4 print:mb-2">
                    <h2 className="font-semibold text-gray-900 mb-2 print:mb-1 text-base print:text-xs border-b pb-1 print:pb-0">
                        Détail des phrases
                    </h2>
                    <div className="space-y-2 print:space-y-0.5">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-100 last:border-b-0 pb-1.5 print:pb-0.5 print-keep-together"
                            >
                                <div className="flex items-start gap-2">
                                    <span className="font-bold text-gray-600 text-xs print:text-[8pt] flex-shrink-0">
                                        {index + 1}.
                                    </span>
                                    <span className="flex-1 text-sm print:text-[8pt] text-gray-900 leading-tight">
                                        {result.expected}
                                    </span>
                                    <span className="text-base print:text-xs flex-shrink-0">
                                        {"⭐".repeat(result.stars) || (
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {printOptions.showAttempts &&
                                    result.attempts.length > 0 && (
                                        <div className="text-xs print:text-[7pt] text-gray-600 mt-0.5 ml-5 leading-tight">
                                            {result.attempts.map((a, i) => (
                                                <span
                                                    key={i}
                                                    className={
                                                        a.isCorrect
                                                            ? "text-green-700"
                                                            : "text-red-700"
                                                    }
                                                >
                                                    {i > 0 && " • "}
                                                    {a.isCorrect ? "✓" : "✗"}
                                                </span>
                                            ))}{" "}
                                            ({result.attempts.length} essai
                                            {result.attempts.length > 1
                                                ? "s"
                                                : ""}
                                            )
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Signature compacte (visible uniquement à l'impression) */}
                <div className="hidden print:block mt-3 pt-2 border-t border-gray-300 text-[8pt]">
                    <div className="flex justify-between">
                        <div className="flex-1">
                            <span>Signature élève :</span>
                            <div className="border-b border-gray-400 w-32 mt-1"></div>
                        </div>
                        <div className="flex-1 text-right">
                            <span>Signature enseignant :</span>
                            <div className="border-b border-gray-400 w-32 mt-1 ml-auto"></div>
                        </div>
                    </div>
                </div>

                {/* Pied de page ultra-compact */}
                <div className="hidden print:block mt-2 text-center text-[7pt] text-gray-500">
                    Dictée Markdown • {dictation.language}
                </div>
            </div>

            {/* Modal d'options d'impression */}
            {showPrintOptions && (
                <div className="no-print fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">
                            Options d'impression
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom de l'élève
                                </label>
                                <input
                                    type="text"
                                    value={printOptions.studentName}
                                    onChange={(e) =>
                                        setPrintOptions({
                                            ...printOptions,
                                            studentName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Prénom Nom"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Classe
                                </label>
                                <input
                                    type="text"
                                    value={printOptions.className}
                                    onChange={(e) =>
                                        setPrintOptions({
                                            ...printOptions,
                                            className: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="CE2-A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enseignant
                                </label>
                                <input
                                    type="text"
                                    value={printOptions.teacherName}
                                    onChange={(e) =>
                                        setPrintOptions({
                                            ...printOptions,
                                            teacherName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="M. Dupont"
                                />
                            </div>

                            <div className="flex items-center pt-2">
                                <input
                                    type="checkbox"
                                    id="showAttempts"
                                    checked={printOptions.showAttempts}
                                    onChange={(e) =>
                                        setPrintOptions({
                                            ...printOptions,
                                            showAttempts: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="showAttempts"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Afficher le détail des tentatives{" "}
                                    <span className="text-xs text-gray-500">
                                        (prend plus de place)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleConfirmPrint}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                            >
                                Imprimer
                            </button>
                            <button
                                onClick={() => setShowPrintOptions(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions (masquées à l'impression) */}
            <div className="flex flex-col sm:flex-row gap-3 no-print">
                <button
                    onClick={onRestart}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Recommencer
                </button>

                <button
                    onClick={handlePrintWithOptions}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
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
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                    </svg>
                    Imprimer / PDF
                </button>

                <button
                    onClick={handlePrint}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold flex items-center justify-center gap-2"
                    title="Impression rapide"
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </button>

                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold"
                >
                    Retour
                </button>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700 no-print">
                💡 <strong>Astuce :</strong> Le mode compact permet de tenir sur
                1 page pour des dictées jusqu'à 15-20 phrases. Désactivez
                "Afficher les tentatives" pour gagner encore plus de place.
            </div>
        </div>
    );
}

export default ResultsView;
