import { useEffect, useReducer } from "react";
import { decodeDictation } from "../services/shareService";
import { fetchMarkdownFromCloud } from "../services/cloudImport";
import { parseMarkdown } from "../services/markdown";

// ---------------------------------------------------------------------------
// Calcul UNIQUE au chargement du module (hors React, hors render)
// ---------------------------------------------------------------------------

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get("share");
    const cloudParam = params.get("cloud");

    if (!shareParam && !cloudParam) {
        return {
            initialState: {
                status: "idle",
                dictation: null,
                error: null,
                mode: null,
            },
            cloudUrl: null,
        };
    }

    if (shareParam) {
        const dictation = decodeDictation(shareParam);

        if (dictation) {
            return {
                initialState: {
                    status: "ready",
                    dictation,
                    error: null,
                    mode: "share",
                },
                cloudUrl: null,
            };
        }

        return {
            initialState: {
                status: "error",
                dictation: null,
                error: "Lien de partage invalide ou corrompu.",
                mode: "share",
            },
            cloudUrl: null,
        };
    }

    if (cloudParam) {
        return {
            initialState: {
                status: "loading",
                dictation: null,
                error: null,
                mode: "cloud",
            },
            cloudUrl: decodeURIComponent(cloudParam),
        };
    }
}

// Calculé une seule fois, au chargement du module
const { initialState, cloudUrl } = parseUrlParams();

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state, action) {
    switch (action.type) {
        case "READY":
            return {
                status: "ready",
                dictation: action.dictation,
                error: null,
                mode: action.mode,
            };
        case "ERROR":
            return {
                status: "error",
                dictation: null,
                error: action.error,
                mode: action.mode,
            };
        default:
            return state;
    }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Analyse les paramètres URL au montage
 * Gère ?share=... (encodage base64) et ?cloud=... (fetch distant)
 * @returns {Object} { status, dictation, error, mode }
 * status : "idle" | "loading" | "ready" | "error"
 * mode : null | "share" | "cloud"
 */
export function useUrlParams() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Rien à faire si pas de fetch cloud nécessaire
        if (!cloudUrl) return;

        let cancelled = false;

        fetchMarkdownFromCloud(cloudUrl)
            .then((markdown) => {
                if (cancelled) return;

                try {
                    const parsed = parseMarkdown(markdown);

                    // Si parseMarkdown ne throw pas, on considère que c'est bon
                    dispatch({
                        type: "READY",
                        mode: "cloud",
                        dictation: {
                            title: parsed.title,
                            language: parsed.language,
                            sentences: parsed.sentences,
                            sourceUrl: cloudUrl,
                        },
                    });
                } catch (err) {
                    // Erreur de format markdown (front matter, etc.)
                    dispatch({
                        type: "ERROR",
                        mode: "cloud",
                        error:
                            err.message ||
                            "Impossible de lire la dictée depuis le cloud.",
                    });
                }
            })
            .catch((err) => {
                if (cancelled) return;
                dispatch({
                    type: "ERROR",
                    mode: "cloud",
                    error: `Erreur de chargement : ${err.message}`,
                });
            });

        return () => {
            cancelled = true;
        };
    }, []); // cloudUrl est une constante de module

    return state;
}
