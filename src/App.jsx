import { useState, useEffect } from "react";
import "./App.css";
import ModeSelector from "./components/ModeSelector";
import TeacherHome from "./components/TeacherHome";
import EditorView from "./components/EditorView";
import PlayerView from "./components/PlayerView";
import VoicesDebugView from "./components/VoicesDebugView";
import { listDictations } from "./services/storage";

/**
 * Composant racine de l'application
 * Gère la navigation SPA sans router
 */
function App() {
    const [mode, setMode] = useState(null); // "teacher" | "student" | null
    const [view, setView] = useState("home"); // "home" | "teacher" | "student" | "editor" | "player"
    const [currentDictationId, setCurrentDictationId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le refresh

    // Détection paramètres URL pour liens directs (futur import cloud)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sourceUrl = params.get("source");
        const legacyUrl = params.get("legacy");

        if (sourceUrl || legacyUrl) {
            // TODO Sprint 6+ : import automatique
            console.log("Import détecté:", { sourceUrl, legacyUrl });
        }
    }, []);

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

    // Vue : Lecteur (à implémenter Sprint 5)
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
