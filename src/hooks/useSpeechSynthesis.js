/**
 * Hook simple pour utiliser la synthèse vocale du navigateur (Web Speech API).
 * V0 : API minimale, remplaçable plus tard par le code plus avancé de l'ancien projet.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useSpeechSynthesis({ language = "fr-FR" } = {}) {
    // Détection du support en dehors de l'effet (calcul synchrone initial)
    const supported = useMemo(() => {
        return (
            typeof window !== "undefined" &&
            "speechSynthesis" in window &&
            "SpeechSynthesisUtterance" in window
        );
    }, []);

    const [speaking, setSpeaking] = useState(false);
    const [error, setError] = useState(() => {
        // Initialisation de l'erreur si non supporté
        if (!supported) {
            return "La synthèse vocale n'est pas supportée par ce navigateur.";
        }
        return null;
    });

    const utteranceRef = useRef(null);

    const cancel = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setSpeaking(false);
    }, [supported]);

    const speak = useCallback(
        (text, lang = language) => {
            if (!supported) {
                setError("Synthèse vocale non disponible.");
                return;
            }
            if (!text || text.trim().length === 0) {
                return;
            }

            // Annuler toute lecture en cours
            window.speechSynthesis.cancel();
            setSpeaking(false);
            setError(null);

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;

            utterance.onstart = () => {
                setSpeaking(true);
            };
            utterance.onend = () => {
                setSpeaking(false);
            };
            utterance.onerror = (e) => {
                console.error("Erreur synthèse vocale:", e);
                setError("Erreur lors de la lecture de la phrase.");
                setSpeaking(false);
            };

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        [language, supported]
    );

    useEffect(() => {
        // Nettoyage : arrêter toute lecture à la destruction du composant
        return () => {
            if (supported && typeof window !== "undefined") {
                window.speechSynthesis.cancel();
            }
        };
    }, [supported]);

    return {
        supported,
        speaking,
        error,
        speak,
        cancel,
    };
}
