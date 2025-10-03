// --- MODO DE PRUEBA ---
// 0 = Funcionamiento normal (hoy es hoy).
// 1 = Simula que "hoy" es mañana.
// 2 = Simula que "hoy" es pasado mañana.
const DATE_OFFSET = 0;  

/**
 * Devuelve la fecha "actual" para toda la aplicación.
 * Si DATE_OFFSET es mayor que 0, devuelve una fecha futura para pruebas.
 * @returns {Date} El objeto Date que representa "hoy".
 */
export function getToday() {
    const today = new Date();
    if (DATE_OFFSET > 0) {
        today.setDate(today.getDate() + DATE_OFFSET);
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