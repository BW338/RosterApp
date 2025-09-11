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
      const foundTimes = rest.slice(airportIdxs[1] + 1).filter(isTime);
      [arrTime, checkout] = [foundTimes[0] || null, foundTimes[1] || null];
    }

    // Detectar avión
    const isAircraft = tk => /^(?:\d{3}|\d{2}[A-Z]|[A-Z]\d{2,3})$/.test(tk);
    const aircraft = rest.reverse().find(tk => !isTime(tk) && !isAirport(tk) && isAircraft(tk)) || null;
    rest.reverse(); // volver al orden original

    // --- NUEVA LÓGICA PARA TV/TSV ---
    // Buscar tiempos que aparecen después del avión y que no son dep/arr/checkout
    const allTimes = rest.filter(isTime);
    
    // Si hay más de 3 tiempos, los últimos probablemente sean TV y TSV
    // Formato típico: checkin, dep, arr, checkout, TV, TSV
    // o dep, arr, checkout, TV, TSV (sin checkin)
    if (allTimes.length >= 5) {
      // Caso: checkin, dep, arr, checkout, TV, TSV
      lastFlightExtraTimes = allTimes.slice(-2); // tomar los últimos 2
    } else if (allTimes.length === 4 && !checkin) {
      // Caso: dep, arr, checkout, TV (falta TSV)
      // En este caso el último tiempo podría ser TV
      const potentialTv = allTimes[allTimes.length - 1];
      // Solo asignamos si este tiempo no es checkout
      if (potentialTv !== checkout) {
        lastFlightExtraTimes = [potentialTv];
      }
    }

    // También buscar patrones específicos como "02:50 02:50 05:00" al final
    // donde los dos primeros son TV repetido y el último es TSV
    const timePattern = rest.join(" ");
    const tripleTimeMatch = timePattern.match(/(\d{1,2}:\d{2})\s+\1\s+(\d{1,2}:\d{2})(?:\s|$)/);
    if (tripleTimeMatch) {
      lastFlightExtraTimes = [tripleTimeMatch[1], tripleTimeMatch[2]]; // TV, TSV
    }

    // --- Detección de vuelos que cruzan medianoche ---
    if (depTime && arrTime && fullDate) {
      const depMinutes = depTime.split(":").map(Number).reduce((h, m) => h * 60 + m);
      const arrMinutes = arrTime.split(":").map(Number).reduce((h, m) => h * 60 + m);
      if (arrMinutes < depMinutes) {
        flights.push({ 
          type: "OP", 
          flightNumber, 
          origin, 
          depTime, 
          destination, 
          arrTime: null, 
          checkin, 
          checkout: null, 
          aircraft, 
          raw: tokens.join(" ") 
        });

        const nextDate = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate() + 1);
        let nextDay = parsedDays.find(d => d.fullDate?.getTime() === nextDate.getTime());
        if (!nextDay) {
          nextDay = { 
            date: null, 
            fullDate: nextDate, 
            flights: [], 
            note: null, 
            tv: null, 
            tsv: null, 
            checkin: null 
          };
          parsedDays.push(nextDay);
        }
        nextDay.flights.push({ 
          type: "OP", 
          flightNumber, 
          origin: destination, 
          depTime: arrTime, 
          destination: null, 
          arrTime: checkout, 
          checkin: null, 
          checkout, 
          aircraft, 
          raw: tokens.join(" ") 
        });
        return;
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

  // Asignar TV y TSV desde lastFlightExtraTimes
  if (lastFlightExtraTimes.length >= 2) {
    [tv, tsv] = lastFlightExtraTimes;
  } else if (lastFlightExtraTimes.length === 1) {
    tv = lastFlightExtraTimes[0];
  }

  return { flights, note, tv, tsv, checkin: firstCheckinOfDay };
};