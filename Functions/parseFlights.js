// parseFlights.js
import { isTime, isAirport } from "./parseUtils.js";

/**
 * Parsea los tokens de un día y devuelve vuelos y tiempos extra
 */
export const parseFlights = (flightTokens, fullDate, parsedDays) => {
  const flights = [];
  let note = null, tv = null, tsv = null, firstCheckinOfDay = null, lastFlightExtraTimes = [];

  flightTokens.forEach(ft => {
    const tokens = ft.trim().split(" ").filter(Boolean);
    if (!tokens.length) return;
    if (/^\d{1,2}[A-Z]{3}$/i.test(tokens[0])) tokens.shift();

    // --- Notas ---
    if (/^(REST|LAYOVER|STBY|OFF)$/i.test(tokens[0])) {
      note = tokens[0];
      return;
    }

    // --- Actividades especiales ---
    if (["*", "D/L", "ESM", "GUA", "ELD", "TOF", "VAC", "MED", "HTL", "VOP"].includes(tokens[0])) {
      flights.push({
        type: tokens[0],
        flightNumber: null,
        origin: tokens[1] || null,
        depTime: tokens[2] || null,
        destination: tokens[3] || null,
        arrTime: tokens[4] || null,
        checkin: null,
        checkout: null,
        aircraft: null,
        raw: tokens.join(" ")
      });
      return;
    }

    // --- Vuelos OP ---
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

    // Buscar aeropuertos
    const airportIdxs = rest.reduce((acc, t, idx) => isAirport(t) ? [...acc, idx] : acc, []);
    const origin = airportIdxs[0] !== undefined ? rest[airportIdxs[0]] : null;
    const destination = airportIdxs[1] !== undefined ? rest[airportIdxs[1]] : null;

    let depTime = null, arrTime = null, checkout = null;
    if (airportIdxs.length >= 1) depTime = rest.slice(airportIdxs[0] + 1).find(isTime) || null;
    if (airportIdxs.length >= 2) {
      const timesAfterDest = rest.slice(airportIdxs[1] + 1).filter(isTime);
      [arrTime, checkout] = [timesAfterDest[0] || null, timesAfterDest[1] || null];
    } else {
      // Si no hay segundo aeropuerto, no hay hora de llegada en este tramo.
      arrTime = null;
    }

    // Detectar avión
    const isAircraft = tk => /^(?:\d{3}|\d{2}[A-Z]|[A-Z]\d{2,3})$/.test(tk);
    const aircraft = rest.reverse().find(tk => !isTime(tk) && !isAirport(tk) && isAircraft(tk)) || null;
    rest.reverse(); // volver al orden original

    // --- Lógica para TV/TSV ---
    // Si es un tramo sin destino, los últimos tiempos son probablemente Rq, TV, TSV.
    if (destination === null) {
      const timeMatches = rest.filter(isTime);
      // depTime ya fue extraído. Los que quedan son los totales.
      const totalTimes = timeMatches.slice(1);
      if (totalTimes.length >= 2) {
        // Asumimos formato [..., TV, TSV]
        tv = totalTimes[totalTimes.length - 2];
        tsv = totalTimes[totalTimes.length - 1];
      }
    } else if (aircraft) { // Buscamos los totales si existe un avión en la línea
      // Lógica unificada para buscar TV/TSV al final de cualquier línea de vuelo
      const tokensAfterAircraft = rest.slice(rest.lastIndexOf(aircraft) + 1);
      // Encontramos el índice del primer token que NO es un tiempo.
      const firstNonTimeIndex = tokensAfterAircraft.findIndex(t => !isTime(t));
      // Los totales son todos los tiempos antes de ese primer token no-tiempo.
      const potentialTotals = (firstNonTimeIndex === -1) 
        ? tokensAfterAircraft.filter(isTime) 
        : tokensAfterAircraft.slice(0, firstNonTimeIndex).filter(isTime);
      
      if (potentialTotals.length >= 2) {
        tv = potentialTotals[potentialTotals.length - 2];
        tsv = potentialTotals[potentialTotals.length - 1];
      }
    }

    flights.push({ 
      type: "OP", 
      flightNumber, 
      origin, 
      depTime, 
      destination, 
      arrTime, 
      checkin, 
      checkout, 
      aircraft, 
      raw: tokens.join(" ") 
    });
  });

  return { flights, note, tv, tsv, checkin: firstCheckinOfDay };
};