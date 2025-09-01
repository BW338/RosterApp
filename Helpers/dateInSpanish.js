// Diccionario inglés → español
const dayMap = {
  MON: "Lunes",
  TUE: "Martes",
  WED: "Miércoles",
  THU: "Jueves",
  FRI: "Viernes",
  SAT: "Sábado",
  SUN: "Domingo",
};

// Convierte "01MON" → "01 Lunes"
export const formatDateShort = (title) => {
  if (!title || title.length < 5) return title;

  const day = title.slice(0, 2);      // "01"
  const dayEng = title.slice(2, 5);   // "MON"
  const dayEsp = dayMap[dayEng] || dayEng;

  return `${day} ${dayEsp}`;
};
