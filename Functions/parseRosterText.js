// Función que parsea el roster (Android e iOS)
export const parseRosterText = (text) => {
  if (!text) return [];

  // Limpiar exceso de espacios y saltos de línea
  let clean = text.replace(/\s+/g, " ").trim();

  // Filtrar pies de página y encabezados típicos
  clean = clean.replace(/Crew Web Portal.*?Individual Roster/gi, "");
  clean = clean.replace(/\d{2}[A-Z]{3}\.\d{2} \d{2}:\d{2}/g, "");

  // Mapa de meses español → inglés
  const spanishToEnglishDay = {
    AGO: "AUG", SEP: "SEP", OCT: "OCT", NOV: "NOV",
    DIC: "DEC", ENE: "JAN", FEB: "FEB", MAR: "MAR",
    ABR: "APR", MAY: "MAY", JUN: "JUN", JUL: "JUL",
  };

  const normalizeDay = (dayStr) => {
    const match = dayStr.match(/^(\d{1,2})([A-Z]{3})$/);
    if (!match) return dayStr;
    const dayNum = match[1];
    const espDay = match[2];
    const engDay = spanishToEnglishDay[espDay] || espDay;
    return `${dayNum}${engDay}`;
  };

  // Helpers de detección
  const isTime = (t) => /^\d{1,2}:\d{2}$/.test(t);
  const isAirport = (t) => /^[A-Z]{3}$/.test(t);

  // Dividir texto por días
  const dayRegex = /(\d{1,2}[A-Z]{3})/g;
  const parts = clean.split(dayRegex).filter(Boolean);

  const parsed = [];
  for (let i = 0; i < parts.length; i++) {
    if (/\d{1,2}[A-Z]{3}/.test(parts[i])) {
      const normalizedDate = normalizeDay(parts[i]);
      const day = { date: normalizedDate, flights: [], note: null };
      const details = parts[i + 1] ? parts[i + 1].trim() : "";

      // Separar por posibles inicios de tramo / actividad
      const flightTokens = details.split(/ (?=OP|ESM|\*|D\/L|REST|LAYOVER|STBY|OFF|AR\d+)/g);

      flightTokens.forEach((ft) => {
        let tokens = ft.trim().split(" ").filter(Boolean);

        // Limpio prefijo "03THU", "11MON", etc. si aparece en el tramo
        if (/^\d{1,2}[A-Z]{3}$/i.test(tokens[0])) tokens.shift();

        // Notas especiales
        if (/^REST|LAYOVER|STBY|OFF$/.test(tokens[0])) {
          day.note = tokens[0];
          return;
        }

        // Tipos especiales con ruta/horarios simples
        if (["*", "D/L", "ESM", "GUA", "ELD", "TOF"].includes(tokens[0])) {
          day.flights.push({
            type: tokens[0],
            origin: tokens[1] || null,
            depTime: tokens[2] || null,
            destination: tokens[3] || null,
            arrTime: tokens[4] || null,
          });
          return;
        }

        // Vuelos
        const startsWithOP = tokens[0] === "OP";
        const idxFlight = startsWithOP ? 1 : 0;
        const flightNumber = tokens[idxFlight];

        if (!/^AR\d+/.test(flightNumber)) return; // no es un tramo de vuelo válido

        // Resto de tokens después del número de vuelo
        const rest = tokens.slice(idxFlight + 1);

        // Buscar origen y destino (primeros 2 aeropuertos AAA)
        const airportIdxs = [];
        for (let k = 0; k < rest.length; k++) {
          if (isAirport(rest[k])) airportIdxs.push(k);
          if (airportIdxs.length === 2) break;
        }

        let origin = null;
        let destination = null;
        let depTime = null;
        let arrTime = null;

        if (airportIdxs.length >= 1) origin = rest[airportIdxs[0]];
        if (airportIdxs.length >= 2) destination = rest[airportIdxs[1]];

        // depTime = primer HH:MM DESPUÉS del origen
        if (airportIdxs.length >= 1) {
          for (let k = airportIdxs[0] + 1; k < rest.length; k++) {
            if (isTime(rest[k])) { depTime = rest[k]; break; }
          }
        }

        // arrTime = primer HH:MM DESPUÉS del destino
        if (airportIdxs.length >= 2) {
          for (let k = airportIdxs[1] + 1; k < rest.length; k++) {
            if (isTime(rest[k])) { arrTime = rest[k]; break; }
          }
        }

        // aircraft = último token que NO sea hora ni aeropuerto
        let aircraft = null;
        for (let k = rest.length - 1; k >= 0; k--) {
          const tk = rest[k];
          if (!isTime(tk) && !isAirport(tk)) { aircraft = tk; break; }
        }

        // Si no encontramos destino/arrTime (ej. cruza día), igual guardamos lo que haya
        day.flights.push({
          type: "OP",                 // mantenemos "OP" para que FlightCard no muestre texto "OP"
          flightNumber,               // ARxxxx
          origin,
          depTime,
          destination,
          arrTime,
          aircraft,
        });
      });

      if (day.flights.length > 0 || day.note) parsed.push(day);
    }
  }

  console.log("LOG 📋 Roster parseado:", parsed);
  return parsed;
};
