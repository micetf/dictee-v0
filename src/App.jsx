import { useState } from "react";
import "./App.css";
import ModeSelector from "./components/ModeSelector";
import TeacherHome from "./components/TeacherHome";
import EditorView from "./components/EditorView";
import PlayerView from "./components/PlayerView";
import VoicesDebugView from "./components/VoicesDebugView";
import { useUrlParams } from "./hooks/useUrlParams";
import { listDictations } from "./services/storage";

/**
 * Composant racine de l'application
 * Gère la navigation SPA sans router
 */
function App() {
    const urlParams = useUrlParams();
    const [mode, setMode] = useState(null); // "teacher" | "student" | null
    const [view, setView] = useState("home"); // "home" | "teacher" | "student" | "editor" | "player"
    const [currentDictationId, setCurrentDictationId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le refresh

    // ✅ AJOUTER - vue dérivée calculée au rendu, sans setState
    const isSharedDictation = !urlParams.loading && !!urlParams.dictation;

    /**
     * Gère la sélection du mode utilisateur
     */
    const handleSelectMode = (selectedMode) => {
        setMode(selectedMode);
        setView(selectedMode); // "teacher" ou "student"
    };

    /**
     * Navigation vers création de dictée
     */
    const handleCreateNew = () => {
        setCurrentDictationId(null);
        setView("editor");
    };

    /**
     * Navigation vers édition d'une dictée
     */
    const handleEdit = (id) => {
        setCurrentDictationId(id);
        setView("editor");
    };

    /**
     * Navigation vers lecture d'une dictée
     */
    const handlePlay = (id) => {
        setCurrentDictationId(id);
        setView("player");
    };

    /**
     * Retour à la bibliothèque avec refresh
     */
    const handleBack = () => {
        setCurrentDictationId(null);
        setView(mode);
        // Incrémenter la clé pour forcer le refresh du composant
        setRefreshKey((prev) => prev + 1);
    };

    /**
     * Navigation vers page de diagnostic des voix
     */
    const handleNavigate = (destination) => {
        console.log("Navigation vers:", destination);
        setView(destination);
    };

    // Chargement en cours (cloud)
    if (urlParams.loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">
                        Chargement de la dictée...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Connexion au cloud en cours
                    </p>
                </div>
            </div>
        );
    }

    // Erreur de chargement
    if (urlParams.error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Erreur de chargement
                    </h1>
                    <p className="text-gray-700 mb-6">{urlParams.error}</p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    // Dictée partagée prête → PlayerView direct, SANS toucher aux états
    if (isSharedDictation) {
        return (
            <PlayerView
                dictationId="shared"
                sharedDictation={urlParams.dictation}
                onBack={() => (window.location.href = "/")}
            />
        );
    }
    // Vue : Sélection du mode
    if (!mode || view === "home") {
        return (
            <div className="app-container">
                <ModeSelector onSelectMode={handleSelectMode} />
            </div>
        );
    }

    // Vue : Mode enseignant
    if (view === "teacher") {
        return (
            <div className="app-container">
                <TeacherHome
                    key={refreshKey} // Force le re-render quand refreshKey change
                    onCreateNew={handleCreateNew}
                    onEdit={handleEdit}
                    onPlay={handlePlay}
                    onBack={() => {
                        setMode(null);
                        setView("home");
                    }}
                    onNavigate={handleNavigate}
                />
            </div>
        );
    }

    // Vue : Mode élève
    if (view === "student") {
        const dictations = listDictations();
        return (
            <div className="app-container">
                <div className="view-container fade-in">
                    <h1 className="text-2xl font-bold mb-4">Mes dictées</h1>
                    {dictations.length === 0 ? (
                        <p className="text-gray-600">
                            Aucune dictée disponible pour l'instant.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {dictations.map((d) => (
                                <li key={d.id}>
                                    <button
                                        className="w-full text-left border rounded p-3 hover:bg-gray-100"
                                        onClick={() => handlePlay(d.id)}
                                    >
                                        <div className="font-semibold">
                                            {d.title || "Sans titre"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {d.sentences.length} phrase(s)
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        className="mt-4 px-4 py-2 border rounded"
                        onClick={() => setView("home")}
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    // Vue : Éditeur
    if (view === "editor") {
        return (
            <div className="app-container">
                <EditorView
                    dictationId={currentDictationId}
                    onBack={handleBack}
                    onSave={(savedDictation) => {
                        console.log("Dictée sauvegardée:", savedDictation);
                    }}
                />
            </div>
        );
    }

    {
        /* Vue : Lecture dictée partagée (lien direct) */
    }
    {
        view === "player-shared" && urlParams.dictation && (
            <PlayerView
                dictationId="shared"
                sharedDictation={urlParams.dictation}
                onBack={() => {
                    window.location.href = window.location.origin;
                }}
            />
        );
    }

    // Vue : Lecteur
    if (view === "player") {
        return (
            <div className="app-container">
                <PlayerView
                    key={currentDictationId}
                    dictationId={currentDictationId}
                    onBack={handleBack}
                />
            </div>
        );
    }

    //  Vue : Diagnostic des voix
    {
        if (view === "voices-debug") {
            return <VoicesDebugView onBack={handleBack} />;
        }
    }

    // Fallback
    return (
        <div className="app-container">
            <div className="view-container">
                <p>État inattendu : {view}</p>
                <button
                    className="px-4 py-2 border rounded"
                    onClick={() => {
                        setView("home");
                        setMode(null);
                    }}
                >
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
}

export default App;
