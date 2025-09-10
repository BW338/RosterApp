// parseFlights.js
import { isTime, isAirport, getLastDayOfMonth } from "./parseUtils.js";

/**
 * Parsea los tokens de un día y devuelve un objeto con vuelos y tiempos extra
 * @param {Array<string>} flightTokens
 * @param {Date} fullDate
 * @param {Array} parsedDays
 * @returns {Object} { flights, note, tv, tsv, checkin }
 */
export const parseFlights = (flightTokens, fullDate, parsedDays) => {
  const flights = [];
  let note = null;
  let tv = null, tsv = null;
  let firstCheckinOfDay = null;
  let lastFlightExtraTimes = [];
  let checkin = null;

  flightTokens.forEach(ft => {
    let tokens = ft.trim().split(" ").filter(Boolean);
    if (/^\d{1,2}[A-Z]{3}$/i.test(tokens[0])) tokens.shift();

    // Notas / días no operativos
    if (/^REST|LAYOVER|STBY|OFF$/.test(tokens[0])) {
      note = tokens[0];
      return;
    }

    // Actividades especiales (no OP)
    if (["*", "D/L", "ESM", "GUA", "ELD", "TOF", "VAC", "MED", "HTL", "VOP"].includes(tokens[0])) {
      flights.push({
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

    // Vuelos OP (ARxxx)
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
    if (airportIdxs.length >= 1) for (let k = airportIdxs[0]+1; k < rest.length; k++) if (isTime(rest[k])) { depTime = rest[k]; break; }
    if (airportIdxs.length >= 2) {
      const foundTimes = [];
      for (let k = airportIdxs[1]+1; k < rest.length; k++) if (isTime(rest[k])) { foundTimes.push(rest[k]); if(foundTimes.length===2) break; }
      arrTime = foundTimes[0] || null;
      checkout = foundTimes[1] || null;
    }

    const isAircraft = tk => /^(?:\d{3}|\d{2}[A-Z]|[A-Z]\d{2,3})$/.test(tk);
    let aircraft = null;
    for (let k = rest.length-1; k >= 0; k--) {
      const tk = (rest[k]||"").trim();
      if (isTime(tk) || isAirport(tk)) continue;
      if (/^(?:TSV:|TV:|Crew|Web|Portal)$/i.test(tk)) continue;
      if (/^\d+(?:\.\d+){2,}$/.test(tk)) continue;
      if (isAircraft(tk)) { aircraft = tk.toUpperCase(); break; }
    }

    const timeMatches = rest.filter(isTime);
    if (timeMatches.length >= 3) lastFlightExtraTimes = timeMatches.slice(-3);

    // Detectar vuelos medianoche
    if (depTime && arrTime && fullDate) {
      const depParts = depTime.split(":").map(Number);
      const arrParts = arrTime.split(":").map(Number);
      const depMinutes = depParts[0]*60 + depParts[1];
      const arrMinutes = arrParts[0]*60 + arrParts[1];

      if (arrMinutes < depMinutes) {
        // Primer tramo
        flights.push({ type:"OP", flightNumber, origin, depTime, destination, arrTime:null, checkin, checkout:null, aircraft });

        const nextDate = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate()+1);
        const nextDay = parsedDays.find(d => d.fullDate?.getTime()===nextDate.getTime()) || { date:null, fullDate:nextDate, flights:[], note:null, tv:null, tsv:null, checkin:null };
        if (!parsedDays.includes(nextDay)) parsedDays.push(nextDay);

        nextDay.flights.push({ type:"OP", flightNumber, origin:destination, depTime:arrTime, destination:origin, arrTime:checkout, checkin:null, checkout, aircraft });
        return;
      }
    }

    flights.push({ type:"OP", flightNumber, origin, depTime, destination, arrTime, checkin, checkout, aircraft });
  });

  if (lastFlightExtraTimes.length >= 3) { tv = lastFlightExtraTimes[1]; tsv = lastFlightExtraTimes[2]; }
  if (firstCheckinOfDay) checkin = firstCheckinOfDay;

  return { flights, note, tv, tsv, checkin };
};
