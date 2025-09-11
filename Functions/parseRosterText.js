// parseRosterText.js
import { MONTH_ABBREVIATIONS } from "./constants.js";
import { detectNightFlights } from "./nightFlights.js";
import { normalizeDay, getLastDayOfMonth } from "./parseUtils.js";
import { parseFlights } from "./parseFlights.js";

/**
 * Parsea el texto del roster y devuelve un array de días con sus vuelos.
 * @param {string} text - Texto completo del roster
 * @returns {Array} parsed
 */
export const parseRosterText = (text) => {
  if (!text) return [];

  // --- Detectar rango de fechas ---
  const headerRangeRegex = /(\d{2})([A-Z]{3})(\d{2})\s*-\s*(\d{2})([A-Z]{3})(\d{2})/;
  const headerMatch = text.match(headerRangeRegex);

  let startDay, startMonthIndex, startYear, endMonthIndex, endYear;
  if (headerMatch) {
    const [, startDayStr, startMonthStr, startYearStr, _endDayStr, endMonthStr, endYearStr] = headerMatch;
    startDay = parseInt(startDayStr, 10);
    startMonthIndex = MONTH_ABBREVIATIONS.indexOf(startMonthStr.toUpperCase());
    startYear = 2000 + parseInt(startYearStr, 10);
    endMonthIndex = MONTH_ABBREVIATIONS.indexOf(endMonthStr.toUpperCase());
    endYear = 2000 + parseInt(endYearStr, 10);
  }

  // --- Limpiar texto ---
  let clean = text.replace(/\s+/g, " ").trim();
  const ignorePatterns = [
    /Crew Web Portal.*?Individual Roster/gi,
    /\d{2}[A-Z]{3}\.\d{2} \d{2}:\d{2}/g,
    /\d{2}[A-Z]{3}\d{2}\s*-\s*\d{2}[A-Z]{3}\d{2}/g,
    /Página \d+ de \d+/gi,
    /BUE-AX \d+/gi,
    /Date DD Activity.*?BLHsch/gi,
    /AMADIO GUIDO.*?(B737\+E90)?/gi,
    /TSV: \d{1,3}:\d{2}/gi,
    /TV: \d{1,3}:\d{2}/gi
  ];
  ignorePatterns.forEach(p => { clean = clean.replace(p, ""); });

  // --- Split por días ---
  const dayRegex = /(\d{1,2}[A-Z]{3})/g;
  const parts = clean.split(dayRegex).filter(Boolean);

  const parsed = [];
  let lastDayNumber = 0;

  for (let i = 0; i < parts.length; i++) {
    if (/\d{1,2}[A-Z]{3}/.test(parts[i])) {
      const normalizedDate = normalizeDay(parts[i]);
      const dayNumberMatch = normalizedDate.match(/^(\d+)/);
      let fullDate = null;

      if (dayNumberMatch && headerMatch) {
        const dayNumber = parseInt(dayNumberMatch[1], 10);
        let currentMonthIndex, currentYear;

        if (lastDayNumber === 0 || parsed.length === 0) {
          currentMonthIndex = startMonthIndex;
          currentYear = startYear;
        } else {
          const prev = parsed[parsed.length - 1];
          if (dayNumber < lastDayNumber) {
            const lastDayPrev = getLastDayOfMonth(
              prev.fullDate.getFullYear(),
              prev.fullDate.getMonth()
            );
            if (lastDayNumber === lastDayPrev) {
              currentMonthIndex = (prev.fullDate.getMonth() + 1) % 12;
              currentYear = currentMonthIndex === 0 ? prev.fullDate.getFullYear() + 1 : prev.fullDate.getFullYear();
            } else {
              currentMonthIndex = prev.fullDate.getMonth();
              currentYear = prev.fullDate.getFullYear();
            }
          } else {
            currentMonthIndex = prev.fullDate.getMonth();
            currentYear = prev.fullDate.getFullYear();
          }
        }
        fullDate = new Date(currentYear, currentMonthIndex, dayNumber);
      }

      const day = {
        date: normalizedDate,
        fullDate,
        flights: [],
        note: null,
        tv: null,
        tsv: null,
        checkin: null
      };

      // --- Parsear vuelos ---
      const details = parts[i + 1] ? parts[i + 1].trim() : "";
      const flightTokens = details.split(
        / (?=OP|AR\d{3,4}Z?|ESM|\*|D\/L|REST|LAYOVER|STBY|OFF|GUA|VOP|VAC|MED|HTL)/g
      );

      const { flights, note, tv, tsv, checkin } = parseFlights(flightTokens, fullDate, parsed);
      Object.assign(day, { flights, note, tv, tsv, checkin });

      lastDayNumber = parseInt(dayNumberMatch[1], 10);
      if (day.flights.length > 0 || day.note) parsed.push(day);
    }
  }

  // --- Detectar vuelos nocturnos ---
  detectNightFlights(parsed);

  console.log("💾 JSON final:", JSON.stringify(parsed, null, 2));
  return parsed;
};
