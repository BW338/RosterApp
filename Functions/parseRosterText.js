const MONTH_ABBREVIATIONS = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

export const parseRosterText = (text) => {
  if (!text) return [];

  // --- INICIO: detectar rango de fechas del encabezado (ej: "23AUG25 - 01OCT25") ---
  const headerRangeRegex = /(\d{2})([A-Z]{3})(\d{2})\s*-\s*(\d{2})([A-Z]{3})(\d{2})/;
  const headerMatch = text.match(headerRangeRegex);

  let startDay, startMonthIndex, startYear, endMonthIndex, endYear;
  if (headerMatch) {
    const [
      ,
      startDayStr, startMonthStr, startYearStr,
      _endDayStr, endMonthStr, endYearStr
    ] = headerMatch;

    startDay = parseInt(startDayStr, 10);
    startMonthIndex = MONTH_ABBREVIATIONS.indexOf(startMonthStr.toUpperCase());
    startYear = 2000 + parseInt(startYearStr, 10);
    endMonthIndex = MONTH_ABBREVIATIONS.indexOf(endMonthStr.toUpperCase());
    endYear = 2000 + parseInt(endYearStr, 10);
  }
  // --- FIN rango fechas ---

  // --- LIMPIEZA: eliminamos headers, pies de página y basura ---
  let clean = text.replace(/\s+/g, " ").trim();

  // Patrones a ignorar
  const ignorePatterns = [
    /Crew Web Portal.*?Individual Roster/gi,
    /\d{2}[A-Z]{3}\.\d{2} \d{2}:\d{2}/g, // 23AGO.25 17:23
    /\d{2}[A-Z]{3}\d{2}\s*-\s*\d{2}[A-Z]{3}\d{2}/g, // rango 23AUG25 - 01OCT25
    /Página \d+ de \d+/gi,
    /BUE-AX \d+/gi,
    /Date DD Activity.*?BLHsch/gi,
    /AMADIO GUIDO.*?(B737\+E90)?/gi,
    /TSV: \d{1,3}:\d{2}/gi,
    /TV: \d{1,3}:\d{2}/gi
  ];
  ignorePatterns.forEach((p) => {
    clean = clean.replace(p, "");
  });

  // Traducciones de meses (cuando vienen en español)
  const spanishToEnglishDay = {
    AGO: "AUG", SEP: "SEP", OCT: "OCT", NOV: "NOV",
    DIC: "DEC", ENE: "JAN", FEB: "FEB", MAR: "MAR",
    ABR: "APR", MAY: "MAY", JUN: "JUN", JUL: "JUL"
  };

  const getLastDayOfMonth = (year, monthIndex) =>
    new Date(year, monthIndex + 1, 0).getDate();

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
  let lastDayNumber = 0;

  for (let i = 0; i < parts.length; i++) {
    if (/\d{1,2}[A-Z]{3}/.test(parts[i])) {
      const normalizedDate = normalizeDay(parts[i]);

      // --- INICIO: construir fullDate coherente ---
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
              // cambio real de mes
              currentMonthIndex = (previousDayObject.fullDate.getMonth() + 1) % 12;
              currentYear =
                currentMonthIndex === 0
                  ? previousDayObject.fullDate.getFullYear() + 1
                  : previousDayObject.fullDate.getFullYear();
            } else {
              // no era fin de mes → mantener mes/año
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
      // --- FIN fullDate ---

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

      flightTokens.forEach((ft) => {
        let tokens = ft.trim().split(" ").filter(Boolean);
        if (/^\d{1,2}[A-Z]{3}$/i.test(tokens[0])) tokens.shift();

        // Días no operativos / notas
        if (/^REST|LAYOVER|STBY|OFF$/.test(tokens[0])) {
          day.note = tokens[0];
          return;
        }

        // Actividades que no son vuelos OP
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
        const startsWithOP = tokens[0] === "OP";
        const idxFlight = startsWithOP ? 1 : 0;
        const flightNumber = tokens[idxFlight];
        if (!/^AR\d+/.test(flightNumber)) return;

        let rest = tokens.slice(idxFlight + 1);

        // Detectar check-in
        let checkin = null;
        if (rest.length > 0 && isTime(rest[0])) {
          checkin = rest[0];
          rest = rest.slice(1);
          if (!firstCheckinOfDay) firstCheckinOfDay = checkin;
        }

        // Buscar aeropuertos
        const airportIdxs = [];
        for (let k = 0; k < rest.length; k++) {
          if (isAirport(rest[k])) airportIdxs.push(k);
          if (airportIdxs.length === 2) break;
        }
        let origin = airportIdxs[0] !== undefined ? rest[airportIdxs[0]] : null;
        let destination = airportIdxs[1] !== undefined ? rest[airportIdxs[1]] : null;

        // Horarios
        let depTime = null;
        let arrTime = null;
        let checkout = null;
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

        // Equipo
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

        // Últimos 3 horarios para TV/TSV
        const timeMatches = rest.filter(isTime);
        if (timeMatches.length >= 3) lastFlightExtraTimes = timeMatches.slice(-3);

        day.flights.push({
          type: "OP",
          flightNumber,
          origin,
          depTime,
          destination,
          arrTime,
          checkin,
          checkout,
          aircraft
        });
      });

      // TV / TSV
      if (lastFlightExtraTimes.length >= 3) {
        day.tv = lastFlightExtraTimes[1];
        day.tsv = lastFlightExtraTimes[2];
      }
      if (firstCheckinOfDay) {
        day.checkin = firstCheckinOfDay;
      }

      lastDayNumber = parseInt(dayNumberMatch[1], 10);
      if (day.flights.length > 0 || day.note) parsed.push(day);
    }
  }

  return parsed;
};
