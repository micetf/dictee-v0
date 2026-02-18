// src/components/HelpModal.jsx
import React from "react";
import { helpContent } from "../utils/helpContent";

export default function HelpModal({
    isOpen,
    onClose,
    mode, // null | "teacher" | "student"
    view, // "home" | "teacher" | "editor" | "student" | "player" | "player-shared" | ...
    currentDictation,
}) {
    if (!isOpen) return null;

    let config = helpContent.home;

    if (mode === "teacher") {
        if (view === "teacher") {
            config = helpContent.teacher.teacherHome;
        } else if (view === "editor") {
            config = helpContent.teacher.editor;
        } else if (view === "player") {
            config = helpContent.teacher.player;
        } else {
            config = helpContent.teacher.teacherHome;
        }
    } else if (mode === "student") {
        if (view === "student") {
            config = helpContent.student.list;
        } else if (view === "player" || view === "player-shared") {
            const type = currentDictation?.type || "sentences";
            config =
                type === "words"
                    ? helpContent.student.playerWords
                    : helpContent.student.playerSentences;
        } else {
            config = helpContent.student.list;
        }
    } else {
        config = helpContent.home;
    }

    const { title, icon, body } = config;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        {icon && (
                            <span
                                role="img"
                                aria-hidden="true"
                                className="text-lg"
                            >
                                {icon}
                            </span>
                        )}
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl leading-none"
                        aria-label="Fermer l'aide"
                    >
                        ×
                    </button>
                </div>

                <div className="px-4 py-3 text-sm text-gray-700 space-y-2">
                    {body.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                <div className="px-4 py-3 border-t text-right">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        J&apos;ai compris
                    </button>
                </div>
            </div>
        </div>
    );
}
