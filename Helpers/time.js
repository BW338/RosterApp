// Resta minutos a un string "HH:MM"
export const subtractMinutes = (timeStr, minutesToSubtract) => {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date(2000, 0, 1, h, m);
  date.setMinutes(date.getMinutes() - minutesToSubtract);
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

// Estilo dinámico según tiempo total
export const getDynamicStyle = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + (minutes || 0);

  return {
    color: totalMinutes >= 480 ? "#6959C2" : "#333",
  };
};
