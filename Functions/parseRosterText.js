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

  // Dividir texto por días
  const dayRegex = /(\d{1,2}[A-Z]{3})/g;
  const parts = clean.split(dayRegex).filter(Boolean);

  const parsed = [];
  for (let i = 0; i < parts.length; i++) {
    if (/\d{1,2}[A-Z]{3}/.test(parts[i])) {
      const normalizedDate = normalizeDay(parts[i]);
      const day = { date: normalizedDate, flights: [], note: null };
      const details = parts[i + 1] ? parts[i + 1].trim() : "";

      // Separar tokens por posibles vuelos o notas
      const flightTokens = details.split(/ (?=OP|ESM|\*|D\/L|REST|LAYOVER|STBY|OFF|AR\d+)/g);

      flightTokens.forEach((ft) => {
        let tokens = ft.trim().split(" ");

        // 🔧 FIX: limpiar fecha/día al inicio (ej: "03THU")
        if (/^\d{1,2}[A-Z]{3}$/i.test(tokens[0])) {
          tokens.shift();
        }

        // Notas especiales
        if (/REST|LAYOVER|STBY|OFF/.test(tokens[0])) {
          day.note = tokens[0];
          return;
        }

        // Tipos especiales (*, D/L, ESM, GUA, ELD, TOF)
        if (["*", "D/L", "ESM", "GUA", "ELD", "TOF"].includes(tokens[0])) {
          day.flights.push({
            type: tokens[0],
            origin: tokens[1],
            depTime: tokens[2],
            destination: tokens[3],
            arrTime: tokens[4],
          });
          return;
        }

        // Vuelos OP o ARxxxx
        if (tokens[0] === "OP" || /^AR\d+/.test(tokens[0])) {
          const isOP = tokens[0] === "OP";
          const flightNumber = isOP ? tokens[1] : tokens[0];
          if (!flightNumber || !/^AR\d+/.test(flightNumber)) return;

          let origin, depTime, destination, arrTime, aircraft;

          if (isOP) {
            // Vuelos con prefijo OP
            origin = tokens[2];
            depTime = tokens[3];
            destination = tokens[4];
            arrTime = tokens[5];
            aircraft = tokens[tokens.length - 1];
          } else {
            // Vuelos ARxxxx
            if (/^\d{2}:\d{2}$/.test(tokens[1])) {
              // 👇 Caso especial: primer tramo del día
              depTime = tokens[1];
              origin = tokens[2];
              arrTime = tokens[3];
              destination = tokens[4];

              // A veces hay horarios extra → tomamos el último válido
              if (/^\d{2}:\d{2}$/.test(tokens[5])) {
                arrTime = tokens[5];
                aircraft = tokens[6];
              } else {
                aircraft = tokens[5];
              }
            } else {
              // 👇 Tramos normales
              origin = tokens[1];
              depTime = tokens[2];
              destination = tokens[3];
              arrTime = tokens[4];
              aircraft = tokens[tokens.length - 1];
            }
          }

          day.flights.push({
            type: "OP",
            flightNumber,
            origin,
            depTime,
            destination,
            arrTime,
            aircraft,
          });
        }
      });

      // Solo agregar días con actividad real
      if (day.flights.length > 0 || day.note) {
        parsed.push(day);
      }
    }
  }

  console.log("LOG 📋 Roster parseado:", parsed);
  return parsed;
};
