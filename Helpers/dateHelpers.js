// src/Helpers/dateHelpers.js
export const formatDateShort = (dateStr) => {
  if (!dateStr) return "";

  let date = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // YYYY-MM-DD
    date = new Date(dateStr + "T00:00:00");
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    // DD/MM/YYYY
    const [day, month, year] = dateStr.split("/").map(Number);
    date = new Date(year, month - 1, day);
  } else if (/^\d{2}[A-Z]{3}$/i.test(dateStr)) {
    // DDMMM (ej. 01SEP)
    const day = parseInt(dateStr.substring(0, 2), 10);
    const monthStr = dateStr.substring(2).toUpperCase();
    const months = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    };
    const month = months[monthStr];
    const year = new Date().getFullYear();
    date = new Date(year, month, day);
  }

  if (!date || isNaN(date.getTime())) return dateStr;

  const dayNum = date.getDate().toString().padStart(2, "0");

  // 🔹 Días de la semana forzados en español
  const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const weekday = weekdays[date.getDay()];

  return `${dayNum} ${weekday}`;
};
