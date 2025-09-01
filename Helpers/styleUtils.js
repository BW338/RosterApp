export const getDynamicStyle = (timeString) => {
  if (!timeString) return {};

  const [hours, minutes] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + (minutes || 0);

  let backgroundColor = "rgba(0,0,0,0.05)";

  if (totalMinutes >= 601) {
    backgroundColor = "rgba(224, 13, 13, 0.44)";
  } else if (totalMinutes >= 480) {
    backgroundColor = "rgba(117, 252, 252, 0.57)";
  }

  return {
    backgroundColor,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  };
};
