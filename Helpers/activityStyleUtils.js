export const getActivityStyle = (activity, isDarkMode) => {
  if (!activity) return {};

  const activityUpper = activity.toUpperCase();
  const baseStyle = { padding: 6, borderRadius: 6 };

  if (isDarkMode) {
    switch (activityUpper) {
      case "*":
      case "D/L":
        return { ...baseStyle, backgroundColor: "rgba(118, 118, 128, 0.24)" };
      case "GUA":
        return { ...baseStyle, backgroundColor: "rgba(255, 69, 58, 0.3)" };
      case "ESM":
        return { ...baseStyle, backgroundColor: "rgba(255, 159, 10, 0.3)" };
      default:
        return { ...baseStyle, backgroundColor: "rgba(72, 72, 74, 0.5)" };
    }
  } else {
    switch (activityUpper) {
      case "*":
      case "D/L":
        return { ...baseStyle, backgroundColor: "rgba(200,200,200,0.3)" };
      case "GUA":
        return { ...baseStyle, backgroundColor: "rgba(250, 117, 100, 0.3)" };
      case "ESM":
        return { ...baseStyle, backgroundColor: "rgba(250,200,100,0.3)" };
      default:
        return { ...baseStyle, backgroundColor: "rgba(220,220,220,0.1)" };
    }
  }
};
