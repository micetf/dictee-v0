/**
 * Utilitaires de formatage de dates
 */

/**
 * Formate un timestamp en date lisible
 * @param {number} timestamp - Timestamp en ms
 * @returns {string} Date formatée (ex: "16/02/2026")
 */
export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Formate un timestamp en date et heure
 * @param {number} timestamp - Timestamp en ms
 * @returns {string} Date et heure formatées (ex: "16/02/2026 19:07")
 */
export function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${formatDate(timestamp)} ${hours}:${minutes}`;
}

/**
 * Retourne une date relative (ex: "aujourd'hui", "hier", "il y a 3 jours")
 * @param {number} timestamp - Timestamp en ms
 * @returns {string} Date relative
 */
export function formatRelativeDate(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "aujourd'hui";
    if (days === 1) return "hier";
    if (days < 7) return `il y a ${days} jours`;
    if (days < 30) return `il y a ${Math.floor(days / 7)} semaine(s)`;
    if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
    return `il y a ${Math.floor(days / 365)} an(s)`;
}
