/**
 * Composant de sélection du mode (enseignant ou élève)
 * Premier écran de l'application
 */
function ModeSelector({ onSelectMode }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Dictée Markdown
                </h1>
                <p className="text-gray-600 text-lg">
                    Créez et pratiquez des dictées facilement
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <button
                    className="btn-large bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => onSelectMode("teacher")}
                    aria-label="Accéder au mode enseignant"
                >
                    <div className="flex flex-col items-center gap-2">
                        <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <span>Je suis enseignant</span>
                    </div>
                </button>

                <button
                    className="btn-large bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onSelectMode("student")}
                    aria-label="Accéder au mode élève"
                >
                    <div className="flex flex-col items-center gap-2">
                        <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <span>Je suis élève</span>
                    </div>
                </button>
            </div>

            <footer className="mt-8 text-sm text-gray-500">
                Version 0.1 - École primaire
            </footer>
        </div>
    );
}

export default ModeSelector;
