// utils.js

import { spanishToEnglishDay } from "./constants.js";

/**
 * Normaliza un día en formato "23AGO" → "23AUG"
 * @param {string} dayStr 
 * @returns {string}
 */
export const normalizeDay = (dayStr) => {
  const match = dayStr.match(/^(\d{1,2})([A-Z]{3})$/);
  if (!match) return dayStr;
  const dayNum = match[1];
  const engDay = spanishToEnglishDay[match[2]] || match[2];
  return `${dayNum}${engDay}`;
};

/**
 * Verifica si un string es horario HH:MM
 * @param {string} t 
 * @returns {boolean}
 */
export const isTime = (t) => /^\d{1,2}:\d{2}$/.test(t);

/**
 * Verifica si un string es código de aeropuerto (3 letras)
 * @param {string} t 
 * @returns {boolean}
 */
export const isAirport = (t) => /^[A-Z]{3}$/.test(t);

/**
 * Devuelve la cantidad de días de un mes específico
 * @param {number} year 
 * @param {number} monthIndex 0-11
 * @returns {number}
 */
export const getLastDayOfMonth = (year, monthIndex) =>
  new Date(year, monthIndex + 1, 0).getDate();
