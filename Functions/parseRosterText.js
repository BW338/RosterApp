// parseRosterText.js
import { MONTH_ABBREVIATIONS } from "./constants.js";
import { detectNightFlights } from "./nightFlights.js";
import { normalizeDay, isTime, isAirport, getLastDayOfMonth } from "./utils.js";

/**
 * Parsea el texto del roster y devuelve un array de días con sus vuelos.
 * @param {string} text - Texto completo del roster
 * @returns {Array} parsed
 */
export const parseRosterText = (text) => {
  if (!text) return [];

  // Detectar rango de fechas
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

  // Limpiar headers y basura
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

  // Split por días
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
          const previousDayObject = parsed[parsed.length - 1];
          if (dayNumber < lastDayNumber) {
            const lastDayOfPrevMonth = getLastDayOfMonth(
              previousDayObject.fullDate.getFullYear(),
              previousDayObject.fullDate.getMonth()
            );
            if (lastDayNumber === lastDayOfPrevMonth) {
              currentMonthIndex = (previousDayObject.fullDate.getMonth() + 1) % 12;
              currentYear = currentMonthIndex === 0
                ? previousDayObject.fullDate.getFullYear() + 1
                : previousDayObject.fullDate.getFullYear();
            } else {
              currentMonthIndex = previousDayObject.fullDate.getMonth();
              currentYear = previousDayObject.fullDate.getFullYear();
            }
          } else {
            currentMonthIndex = previousDayObject.fullDate.getMonth();
            currentYear = previousDayObject.fullDate.getFullYear();
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

      const details = parts[i + 1] ? parts[i + 1].trim() : "";
      const flightTokens = details.split(
        / (?=OP|ESM|\*|D\/L|REST|LAYOVER|STBY|OFF|GUA|VOP|VAC|MED|HTL)/g
      );

      let lastFlightExtraTimes = [];
      let firstCheckinOfDay = null;

      flightTokens.forEach(ft => {
        let tokens = ft.trim().split(" ").filter(Boolean);
        if (/^\d{1,2}[A-Z]{3}$/i.test(tokens[0])) tokens.shift();

        if (/^REST|LAYOVER|STBY|OFF$/.test(tokens[0])) {
          day.note = tokens[0];
          return;
        }

        if (["*", "D/L", "ESM", "GUA", "ELD", "TOF", "VAC", "MED", "HTL", "VOP"].includes(tokens[0])) {
          day.flights.push({
            type: tokens[0],
            origin: tokens[1] || null,
            depTime: tokens[2] || null,
            destination: tokens[3] || null,
            arrTime: tokens[4] || null,
            checkin: null,
            checkout: null,
            aircraft: null,
          });
          return;
        }

        // Vuelos OP
        const flightNumberIdx = tokens.findIndex(t => /^AR\d+/.test(t));
        if (flightNumberIdx === -1) return;

        const flightNumber = tokens[flightNumberIdx];
        let rest = tokens.slice(flightNumberIdx + 1);

        let checkin = null;
        if (rest.length > 0 && isTime(rest[0])) {
          checkin = rest[0];
          rest = rest.slice(1);
          if (!firstCheckinOfDay) firstCheckinOfDay = checkin;
        }

        const airportIdxs = [];
        for (let k = 0; k < rest.length; k++) {
          if (isAirport(rest[k])) airportIdxs.push(k);
          if (airportIdxs.length === 2) break;
        }
        let origin = airportIdxs[0] !== undefined ? rest[airportIdxs[0]] : null;
        let destination = airportIdxs[1] !== undefined ? rest[airportIdxs[1]] : null;

        let depTime = null, arrTime = null, checkout = null;
        if (airportIdxs.length >= 1) {
          for (let k = airportIdxs[0] + 1; k < rest.length; k++) {
            if (isTime(rest[k])) { depTime = rest[k]; break; }
          }
        }
        if (airportIdxs.length >= 2) {
          const foundTimes = [];
          for (let k = airportIdxs[1] + 1; k < rest.length; k++) {
            if (isTime(rest[k])) {
              foundTimes.push(rest[k]);
              if (foundTimes.length === 2) break;
            }
          }
          arrTime = foundTimes[0] || null;
          checkout = foundTimes[1] || null;
        }

        const isAircraft = (tk) => /^(?:\d{3}|\d{2}[A-Z]|[A-Z]\d{2,3})$/.test(tk);
        let aircraft = null;
        for (let k = rest.length - 1; k >= 0; k--) {
          const tk = (rest[k] || "").trim();
          if (isTime(tk) || isAirport(tk)) continue;
          if (/^(?:TSV:|TV:|Crew|Web|Portal)$/i.test(tk)) continue;
          if (/^\d+(?:\.\d+){2,}$/.test(tk)) continue;
          if (isAircraft(tk)) { aircraft = tk.toUpperCase(); break; }
        }

        const timeMatches = rest.filter(isTime);
        if (timeMatches.length >= 3) lastFlightExtraTimes = timeMatches.slice(-3);

        // Detectar vuelos medianoche
        if (depTime && arrTime) {
          const depParts = depTime.split(":").map(Number);
          const arrParts = arrTime.split(":").map(Number);
          const depMinutes = depParts[0]*60 + depParts[1];
          const arrMinutes = arrParts[0]*60 + arrParts[1];

          if (arrMinutes < depMinutes && day.fullDate) {
            day.flights.push({
              type: "OP",
              flightNumber,
              origin,
              depTime,
              destination,
              arrTime: null,
              checkin,
              checkout: null,
              aircraft
            });

            const nextDate = new Date(day.fullDate.getFullYear(), day.fullDate.getMonth(), day.fullDate.getDate() + 1);
            const nextDay = parsed.find(d => d.fullDate?.getTime() === nextDate.getTime()) || {
              date: null,
              fullDate: nextDate,
              flights: [],
              note: null,
              tv: null,
              tsv: null,
              checkin: null
            };
            if (!parsed.includes(nextDay)) parsed.push(nextDay);

            nextDay.flights.push({
              type: "OP",
              flightNumber,
              origin: destination,
              depTime: arrTime,
              destination: origin,
              arrTime: checkout,
              checkin: null,
              checkout,
              aircraft
            });

            return;
          }
        }

        // Vuelo normal
        day.flights.push({ type: "OP", flightNumber, origin, depTime, destination, arrTime, checkin, checkout, aircraft });
      });

      if (lastFlightExtraTimes.length >= 3) {
        day.tv = lastFlightExtraTimes[1];
        day.tsv = lastFlightExtraTimes[2];
      }
      if (firstCheckinOfDay) day.checkin = firstCheckinOfDay;

      lastDayNumber = parseInt(dayNumberMatch[1], 10);
      if (day.flights.length > 0 || day.note) parsed.push(day);
    }
  }

  // Detectar vuelos nocturnos usando módulo externo
  detectNightFlights(parsed);

  return parsed;
};
