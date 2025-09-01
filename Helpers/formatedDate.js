// src/helpers/formatDate.js

export function formatDate(dateStr) {
  if (!dateStr) return "";

  try {
    // dateStr viene tipo "01JAN"
    const day = parseInt(dateStr.slice(0, 2), 10);
    const monthStr = dateStr.slice(2).toUpperCase();

    const months = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    };

    if (!(monthStr in months)) return dateStr;

    // usamos 2025 como base (no importa el año, solo día y mes)
    const jsDate = new Date(2025, months[monthStr], day);

    // 👇 Definimos nosotros mismos los días en español
    const dias = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    const weekday = dias[jsDate.getDay()];

    // Salida: "01 LUN"
    return `${String(day).padStart(2, "0")} ${weekday}`;
  } catch (e) {
    return dateStr;
  }
}
