import { useState } from "react";
import {
    generateShareLink,
    generateCloudShareLink,
    canShareByEncoding,
    getCloudServiceName,
} from "../services/shareService";

/**
 * Modal de partage de dictée
 * Propose encodage URL ou lien cloud selon contexte
 */
function ShareModal({ dictation, onClose }) {
    const [activeTab, setActiveTab] = useState("encoding"); // "encoding" | "cloud"
    const [copied, setCopied] = useState(false);

    const encodingCheck = canShareByEncoding(dictation);
    const hasCloudSource = dictation.sourceUrl; // Si importée depuis cloud

    // Génération des liens
    const shareLink = encodingCheck.canShare
        ? generateShareLink(dictation)
        : null;

    const cloudLink = hasCloudSource
        ? generateCloudShareLink(dictation.sourceUrl)
        : null;

    const cloudServiceName = hasCloudSource
        ? getCloudServiceName(dictation.sourceUrl)
        : null;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Partager la dictée
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {dictation.title}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Onglets */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("encoding")}
                            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                                activeTab === "encoding"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            🔗 Lien direct (encodé)
                        </button>
                        {hasCloudSource && (
                            <button
                                onClick={() => setActiveTab("cloud")}
                                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                                    activeTab === "cloud"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                ☁️ Lien cloud ({cloudServiceName})
                            </button>
                        )}
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                    {/* Onglet Encodage */}
                    {activeTab === "encoding" && (
                        <div>
                            {encodingCheck.canShare ? (
                                <>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-3">
                                            Ce lien contient toute la dictée.
                                            Les élèves accèdent directement à la
                                            dictée sans configuration.
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={shareLink.url}
                                                readOnly
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 font-mono"
                                                onClick={(e) =>
                                                    e.target.select()
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    handleCopy(shareLink.url)
                                                }
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                                            >
                                                {copied ? "✓ Copié" : "Copier"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Informations */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                                        <p className="font-semibold text-blue-900 mb-2">
                                            ✓ Lien prêt à partager
                                        </p>
                                        <ul className="text-blue-800 space-y-1">
                                            <li>
                                                • {dictation.sentences.length}{" "}
                                                phrases (max 20)
                                            </li>
                                            <li>
                                                • Longueur :{" "}
                                                {shareLink.url.length}{" "}
                                                caractères
                                            </li>
                                            <li>
                                                • Utilisable dans Pronote, ENT,
                                                email, QR code
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <p className="font-semibold text-orange-900 mb-2">
                                        ⚠️ Impossible de créer un lien direct
                                    </p>
                                    <p className="text-orange-800 text-sm mb-3">
                                        {encodingCheck.reason}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        💡 <strong>Solution</strong> : Utilisez
                                        le partage par cloud en important
                                        d'abord cette dictée depuis CodiMD ou
                                        Nuage.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Onglet Cloud */}
                    {activeTab === "cloud" && hasCloudSource && (
                        <div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    Ce lien charge la dictée depuis{" "}
                                    {cloudServiceName}. Pas de limite de taille,
                                    mais nécessite une connexion internet.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={cloudLink}
                                        readOnly
                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 font-mono"
                                        onClick={(e) => e.target.select()}
                                    />
                                    <button
                                        onClick={() => handleCopy(cloudLink)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                                    >
                                        {copied ? "✓ Copié" : "Copier"}
                                    </button>
                                </div>
                            </div>

                            {/* Informations */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                                <p className="font-semibold text-green-900 mb-2">
                                    ✓ Lien cloud prêt
                                </p>
                                <ul className="text-green-800 space-y-1">
                                    <li>• Source : {cloudServiceName}</li>
                                    <li>• Pas de limite de phrases</li>
                                    <li>
                                        • Mises à jour automatiques si vous
                                        modifiez le fichier
                                    </li>
                                    <li>• Nécessite connexion internet</li>
                                </ul>
                            </div>

                            {/* Détails source */}
                            <details className="mt-4">
                                <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                                    Voir l'URL source
                                </summary>
                                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono break-all text-gray-700">
                                    {dictation.sourceUrl}
                                </div>
                            </details>
                        </div>
                    )}
                </div>

                {/* Pied */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-600">
                        💡 <strong>Astuce</strong> : Les élèves n'ont pas besoin
                        de compte. Ils cliquent sur le lien et la dictée démarre
                        automatiquement.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShareModal;
