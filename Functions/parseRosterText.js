const MONTH_ABBREVIATIONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const parseRosterText = (text) => {
  if (!text) return [];

  // --- INICIO: LÓGICA DE FECHAS ---
  // 1. Buscamos el rango de fechas del encabezado ANTES de limpiar el texto.
  //    Ejemplo: "31AUG25 - 01OCT25"
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
  // --- FIN: LÓGICA DE FECHAS ---

  let clean = text.replace(/\s+/g, " ").trim();
  // Limpiamos las líneas que ya no necesitamos
  clean = clean.replace(/Crew Web Portal.*?Individual Roster/gi, "");
  clean = clean.replace(/\d{2}[A-Z]{3}\.\d{2} \d{2}:\d{2}/g, "");

  const spanishToEnglishDay = {
    AGO: "AUG", SEP: "SEP", OCT: "OCT", NOV: "NOV",
    DIC: "DEC", ENE: "JAN", FEB: "FEB", MAR: "MAR",
    ABR: "APR", MAY: "MAY", JUN: "JUN", JUL: "JUL",
  };

  const normalizeDay = (dayStr) => {
    const match = dayStr.match(/^(\d{1,2})([A-Z]{3})$/);
    if (!match) return dayStr;
    const dayNum = match[1];
    const engDay = spanishToEnglishDay[match[2]] || match[2];
    return `${dayNum}${engDay}`;
  };

  const isTime = (t) => /^\d{1,2}:\d{2}$/.test(t);
  const isAirport = (t) => /^[A-Z]{3}$/.test(t);

  const dayRegex = /(\d{1,2}[A-Z]{3})/g;
  const parts = clean.split(dayRegex).filter(Boolean);

  const parsed = [];
  let lastDayNumber = 0; // Variable para detectar el cambio de mes

  for (let i = 0; i < parts.length; i++) {
    if (/\d{1,2}[A-Z]{3}/.test(parts[i])) {
      const normalizedDate = normalizeDay(parts[i]);

      // --- INICIO: APLICACIÓN DE LÓGICA DE FECHAS ---
      const dayNumberMatch = normalizedDate.match(/^(\d+)/);
      let fullDate = null; // Esta será la fecha completa (ej: new Date(2025, 7, 31))

      if (dayNumberMatch && headerMatch) {
        const dayNumber = parseInt(dayNumberMatch[1], 10);
        let currentMonthIndex, currentYear;

        // Si es el primer día que procesamos (o si el array de resultados aún está vacío),
        // usamos el mes/año de inicio del encabezado.
        if (lastDayNumber === 0 || parsed.length === 0) {
          currentMonthIndex = startMonthIndex;
          currentYear = startYear;
        } else {
          const previousDayObject = parsed[parsed.length - 1];
          // Si el día actual es menor que el anterior (ej: 31 -> 1), avanzamos un mes.
          if (dayNumber < lastDayNumber) {
            currentMonthIndex = (previousDayObject.fullDate.getMonth() + 1) % 12;
            // Si el mes pasa de Diciembre (11) a Enero (0), avanzamos un año.
            currentYear = currentMonthIndex === 0 ? previousDayObject.fullDate.getFullYear() + 1 : previousDayObject.fullDate.getFullYear();
          } else { // Si no, seguimos en el mismo mes y año que el día anterior.
            currentMonthIndex = previousDayObject.fullDate.getMonth();
            currentYear = previousDayObject.fullDate.getFullYear();
          }
        }
        fullDate = new Date(currentYear, currentMonthIndex, dayNumber);
      }
      // --- FIN: APLICACIÓN DE LÓGICA DE FECHAS ---

      const day = { date: normalizedDate, fullDate: fullDate, flights: [], note: null, tv: null, tsv: null };
      const details = parts[i + 1] ? parts[i + 1].trim() : "";

      const flightTokens = details.split(/ (?=OP|ESM|\*|D\/L|REST|LAYOVER|STBY|OFF|AR\d+)/g);

      let lastFlightExtraTimes = [];

      flightTokens.forEach((ft) => {
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
          });
          return;
        }

        const startsWithOP = tokens[0] === "OP";
        const idxFlight = startsWithOP ? 1 : 0;
        const flightNumber = tokens[idxFlight];
        if (!/^AR\d+/.test(flightNumber)) return;

        const rest = tokens.slice(idxFlight + 1);
        const airportIdxs = [];
        for (let k = 0; k < rest.length; k++) {
          if (isAirport(rest[k])) airportIdxs.push(k);
          if (airportIdxs.length === 2) break;
        }

        let origin = airportIdxs[0] !== undefined ? rest[airportIdxs[0]] : null;
        let destination = airportIdxs[1] !== undefined ? rest[airportIdxs[1]] : null;

        let depTime = null;
        let arrTime = null;
        let checkout = null;
        
        if (airportIdxs.length >= 1) {
  for (let k = airportIdxs[0] + 1; k < rest.length; k++) {
    if (isTime(rest[k])) { depTime = rest[k]; break; }
  }
}
if (airportIdxs.length >= 2) {
  // buscamos arrTime y checkout
  let foundTimes = [];
  for (let k = airportIdxs[1] + 1; k < rest.length; k++) {
    if (isTime(rest[k])) {
      foundTimes.push(rest[k]);
      if (foundTimes.length === 2) break; // llegada + checkout
    }
  }
  arrTime = foundTimes[0] || null;
  checkout = foundTimes[1] || null;
}

        const isAircraft = (tk) => /^(?:\d{3}|\d{2}[A-Z]|[A-Z]\d{2,3})$/.test(tk);
        let aircraft = null;
        for (let k = rest.length - 1; k >= 0; k--) {
          const tk = (rest[k] || "").trim();
          if (isTime(tk)) continue;
          if (isAirport(tk)) continue;
          if (/^(?:TSV:|TV:|Crew|Web|Portal)$/i.test(tk)) continue;
          if (/^\d+(?:\.\d+){2,}$/.test(tk)) continue;
          if (isAircraft(tk)) { aircraft = tk.toUpperCase(); break; }
        }

        // Guardamos los últimos 3 horarios tipo HH:MM después del equipo
        const timeMatches = rest.filter(isTime);
        if (timeMatches.length >= 3) lastFlightExtraTimes = timeMatches.slice(-3);

        day.flights.push({
  type: "OP",
  flightNumber,
  origin,
  depTime,
  destination,
  arrTime,
  checkout,   // 👈 lo nuevo
  aircraft
});

      });

      // Asignamos TV y TSV según los últimos horarios del último vuelo del día
      if (lastFlightExtraTimes.length >= 3) {
        day.tv = lastFlightExtraTimes[1];  // penúltimo
        day.tsv = lastFlightExtraTimes[2]; // último
      }

      // --- LOG DE DEPURACIÓN ---
      // Imprimimos el objeto 'day' completo para ver qué se ha parseado.
      console.log("Día parseado:", JSON.stringify(day, null, 2));
      lastDayNumber = parseInt(dayNumberMatch[1], 10); // Actualizamos el último día procesado
      if (day.flights.length > 0 || day.note) parsed.push(day);
    }
  }

  return parsed;
};
