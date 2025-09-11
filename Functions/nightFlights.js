// nightFlights.js
import { isTime } from "./parseUtils.js";

/**
 * Corrige vuelos que se extienden por dos días, combinando la información
 * y asignando el vuelo completo al día de aterrizaje.
 * @param {Array} days - array de días ya parseados
 */
export const detectNightFlights = (days) => {
  for (let i = 0; i < days.length - 1; i++) {
    const currentDay = days[i];
    const nextDay = days[i + 1];
    if (!currentDay?.flights?.length || !nextDay?.flights?.length) {
      continue;
    }

    const lastFlightOfCurrentDay = currentDay.flights[currentDay.flights.length - 1];
    const firstFlightOfNextDay = nextDay.flights[0];

    // Patrón: el último vuelo del día es una salida incompleta, y el primero del día siguiente
    // es una llegada incompleta con el mismo número de vuelo.
    if (
      lastFlightOfCurrentDay.type === 'OP' &&
      lastFlightOfCurrentDay.destination === null &&
      firstFlightOfNextDay.type === 'OP' &&
      firstFlightOfNextDay.flightNumber === lastFlightOfCurrentDay.flightNumber &&
      firstFlightOfNextDay.destination === null // Indica que fue mal parseado como salida
    ) {
      // Re-parsear el checkout de la parte de llegada
      const rawArrivalTokens = firstFlightOfNextDay.raw.split(' ').filter(Boolean);
      const arrivalTimes = rawArrivalTokens.filter(isTime);
      const checkoutTime = arrivalTimes.length > 1 ? arrivalTimes[1] : null;

      // Construir el vuelo completo
      const completeFlight = {
        ...lastFlightOfCurrentDay,
        destination: firstFlightOfNextDay.origin, // El origen mal parseado es el destino real
        arrTime: firstFlightOfNextDay.depTime,   // La salida mal parseada es la llegada real
        checkout: checkoutTime,
      };

      // Mover el vuelo completo al día de aterrizaje (nextDay)
      nextDay.flights[0] = completeFlight;
      currentDay.flights.pop(); // Eliminar la parte de salida del día anterior

      // Mover los totales (TV, TSV) al día de aterrizaje
      nextDay.tv = currentDay.tv;
      nextDay.tsv = currentDay.tsv;
      currentDay.tv = null;
      currentDay.tsv = null;
    }
  }
};
