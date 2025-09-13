export const getDynamicStyle = (timeString, isDarkMode) => {
  if (!timeString) return {};

  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + (minutes || 0);

  let backgroundColor = isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0,0,0,0.05)";

  if (totalMinutes >= 601) {
    backgroundColor = isDarkMode ? "rgba(255, 80, 80, 0.6)" : "rgba(224, 13, 13, 0.44)";
  } else if (totalMinutes >= 480) {
    backgroundColor = isDarkMode ? "rgba(48, 144, 255, 0.6)" : "rgba(117, 252, 252, 0.57)";
  }

  return {
    backgroundColor,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  };
};
