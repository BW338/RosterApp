// nightFlights.js
import { isTime } from "./parseUtils.js";

/**
 * Corrige vuelos nocturnos.
 * 1. Completa la información del vuelo en el día de salida.
 * 2. Crea una entrada de "solo llegada" en el día de aterrizaje.
 * 3. Mueve los totales (TV, TSV) y el checkout al día de aterrizaje.
 * @param {Array} days - array de días ya parseados
 */
export const detectNightFlights = (days) => {
  // Iterar hacia atrás para poder eliminar elementos de forma segura
  for (let i = days.length - 2; i >= 0; i--) {
    const currentDay = days[i];
    const nextDay = days[i + 1];
    if (!currentDay?.flights?.length || !nextDay?.flights?.length) {
      continue;
    }

    // Patrón: Buscar un vuelo de salida incompleto (sin destino ni hora de llegada)
    const departureLeg = currentDay.flights.find(
      (f) => f.type === "OP" && f.destination === null && f.arrTime === null
    );
    if (!departureLeg) continue;

    // Patrón: Buscar su parte de llegada en el día siguiente (mal parseada como una salida)
    const arrivalLegIndex = nextDay.flights.findIndex(
      (f) =>
        f.type === "OP" &&
        f.flightNumber === departureLeg.flightNumber &&
        (f.destination === null || f.origin === null) // Hacemos la condición más flexible
    );
    if (arrivalLegIndex === -1) continue;

    const arrivalLeg = nextDay.flights[arrivalLegIndex];

    // 1. Completar la información en el vuelo de salida (currentDay)
    const rawArrivalTokens = arrivalLeg.raw.split(' ').filter(Boolean);
    const arrivalTimes = rawArrivalTokens.filter(isTime);
    const finalCheckout = arrivalTimes.length > 1 ? arrivalTimes[1] : null;
    
    departureLeg.destination = arrivalLeg.origin; // El "origen" del tramo de llegada es el destino real
    departureLeg.arrTime = arrivalLeg.depTime; // El "depTime" del tramo de llegada es la hora de arribo real
    departureLeg.checkout = null; // El checkout ocurre en el día siguiente

    // 2. Si el día de llegada tiene más vuelos, eliminamos el tramo de llegada redundante.
    //    Si no, lo transformamos en una tarjeta de "solo llegada" para que el día no quede vacío.
    if (nextDay.flights.length > 1) {
      nextDay.flights.splice(arrivalLegIndex, 1);
    } else {
      // Transformar en "solo llegada"
      arrivalLeg.origin = null;
      arrivalLeg.depTime = null;
      arrivalLeg.destination = departureLeg.destination; // Aseguramos que se muestre el destino
      arrivalLeg.checkout = finalCheckout;
    }

    // 3. Mover los totales (TV, TSV) al día de aterrizaje
    nextDay.tv = currentDay.tv;
    nextDay.tsv = currentDay.tsv;
    currentDay.tv = null;
    currentDay.tsv = null;
  }
};
