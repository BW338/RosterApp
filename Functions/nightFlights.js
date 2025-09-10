// nightFlights.js
/**
 * Detecta vuelos nocturnos entre días consecutivos.
 * @param {Array} parsed - Array de objetos día con sus vuelos.
 */
export const detectNightFlights = (parsed) => {
  for (let i = 0; i < parsed.length - 1; i++) {
    const today = parsed[i];
    const tomorrow = parsed[i + 1];

    today.flights.forEach(f1 => {
      if (f1.type !== "OP" || !f1.depTime) return;

      tomorrow.flights.forEach(f2 => {
        if (f2.type !== "OP" || !f2.depTime) return;

        // Caso 1: mismo número de vuelo en dos días
        if (f1.flightNumber === f2.flightNumber) {
          console.log("🌙 Vuelo nocturno (mismo número):", {
            dia1: today.fullDate?.toDateString(),
            flight: f1.flightNumber,
            arr: f1.arrTime,
            dia2: tomorrow.fullDate?.toDateString(),
            dep: f2.depTime
          });
        }

        // Caso 2: vuelos consecutivos distintos que se enganchan entre medianoche
        if (f1.arrTime && f2.depTime) {
          const [arrH, arrM] = f1.arrTime.split(":").map(Number);
          const [depH, depM] = f2.depTime.split(":").map(Number);
          const arrMinutes = arrH * 60 + arrM;
          const depMinutes = depH * 60 + depM;

          if (arrMinutes > depMinutes) {
            console.log("🌙 Vuelo nocturno (cadena distinta):", {
              dia1: today.fullDate?.toDateString(),
              flight1: f1.flightNumber,
              arr: f1.arrTime,
              dia2: tomorrow.fullDate?.toDateString(),
              flight2: f2.flightNumber,
              dep: f2.depTime
            });
          }
        }
      });
    });
  }
};
