import moment from 'moment';

/**
 * Calcula la hora máxima de aterrizaje (último ETA) basada en la hora de check-in.
 * @param {string} checkinTime - La hora de check-in en formato "HH:mm".
 * @returns {string|null} - La hora del último aterrizaje en formato "HH:mm" o null si no se puede calcular.
 */
export function calculateLastLanding(checkinTime) {
  if (!checkinTime || !moment(checkinTime, "HH:mm", true).isValid()) {
    return null;
  }

  const checkinMoment = moment(checkinTime, "HH:mm");
  const CKh = checkinMoment.hours();
  const CKm = checkinMoment.minutes();
  let multiplo = 0;

  if (CKh >= 19 || CKh <= 5) {
    const reductionMap = { 19: 3, 20: 3, 21: 3, 22: 3, 23: 3, 0: 3, 1: 2.5, 2: 2, 3: 1.5, 4: 1, 5: 0.5 };
    multiplo = reductionMap[CKh] ?? 0;
  } else if (CKh >= 11 && CKh <= 18) {
    if (CKh === 11 && CKm >= 15) multiplo = 0.25;
    else if ((CKh === 11 && CKm >= 30) || (CKh === 12 && CKm < 45)) multiplo = 0.5;
    else if (CKh === 12 && CKm >= 45) multiplo = 0.75;
    else if (CKh === 13 || (CKh === 14 && CKm < 15)) multiplo = 1;
    else if (CKh === 14 && CKm >= 15) multiplo = 1.25;
    else if ((CKh === 14 && CKm >= 30) || (CKh === 15 && CKm <= 45)) multiplo = 1.5;
    else if (CKh === 15 && CKm >= 45) multiplo = 1.75;
    else if (CKh === 16 || (CKh === 17 && CKm < 15)) multiplo = 2;
    else if (CKh === 17 && CKm >= 15) multiplo = 2.25;
    else if ((CKh === 17 && CKm > 15) || (CKh === 18 && CKm < 45)) multiplo = 2.5;
    else if (CKh === 18 && CKm >= 45) multiplo = 2.75;
  }

  const baseServiceHours = 13;
  const reductionHours = multiplo;
  const endOfServiceMinutes = 30;

  const lastLandingMoment = checkinMoment.clone().add(baseServiceHours, 'hours').subtract(reductionHours, 'hours').subtract(endOfServiceMinutes, 'minutes');
  
  return lastLandingMoment.format("HH:mm");
}

/**
 * Calcula las horas Flex generadas a partir del Tiempo Total de Servicio Efectivo (TTEE).
 * @param {string} ttee - El tiempo en formato "HH:mm".
 * @returns {number} - Retorna 0, 2, o 4 dependiendo de las horas Flex generadas.
 */
export function calculateFlexHours(ttee) {
  if (!ttee || !moment(ttee, "HH:mm", true).isValid()) {
    return 0;
  }

  const [hours, minutes] = ttee.split(':').map(Number);

  if (hours > 10 || (hours === 10 && minutes > 0)) {
    return 4; // 4 horas Flex si TTEE es mayor a 10:00
  }
  
  if (hours > 8 || (hours === 8 && minutes > 0)) {
    return 2; // 2 horas Flex si TTEE es mayor a 08:00 y hasta 10:00
  }

  return 0; // 0 horas Flex si TTEE es 08:00 o menos
}