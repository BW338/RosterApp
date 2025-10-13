import { AppConfig } from "../Helpers/debugConfig";

/**
 * Devuelve la fecha "actual" para toda la aplicación.
 * Si DATE_OFFSET es mayor que 0, devuelve una fecha futura para pruebas.
 * @returns {Date} El objeto Date que representa "hoy".
 */
export function getToday() {
    const today = new Date();
    if (AppConfig.DATE_OFFSET > 0) { // <--- 2. Usamos la configuración central
        today.setDate(today.getDate() + AppConfig.DATE_OFFSET);
    }
    return today;
}

/**
 * Compara si una fecha dada es "hoy" (respetando el offset de prueba).
 * @param {Date | string} someDate - La fecha a comparar.
 * @returns {boolean} - True si es "hoy", false en caso contrario.
 */
export function isTodayWithOffset(someDate) {
  if (!someDate) return false;
  const today = getToday();
  const d = new Date(someDate);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}