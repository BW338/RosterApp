  export function subtractMinutes(time, minutes) {
    if (!time) return null;

    const [h, m] = time.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() - minutes);

    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // 🔹 Devuelve true si el título de la sección corresponde a hoy
  export function isToday(title) {
    if (!title || title.length < 5) return false;

    // "01MON" → extraemos el número del día
    const day = parseInt(title.slice(0, 2), 10);
    const today = new Date();

    return day === today.getDate();
  }

  // 🔹 Devuelve true si la fecha corresponde a hoy (día, mes y año)
  export function isTodayStrict(fullDate) {
    if (!fullDate) return false;

    const d = new Date(fullDate);
    const today = new Date();

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }
