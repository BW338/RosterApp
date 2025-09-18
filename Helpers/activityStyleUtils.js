export const getActivityStyle = (activity, isDarkMode) => {
  if (!activity) return {};

  const activityUpper = activity.toUpperCase();
  const baseStyle = { padding: 6, borderRadius: 6 };

  const darkColors = {
    "*": "rgba(118, 118, 128, 0.24)",
    "D/L": "rgba(118, 118, 128, 0.24)",
    "GUA": "rgba(255, 69, 58, 0.3)",
    "ESM": "rgba(255, 159, 10, 0.3)",
    default: "rgba(72, 72, 74, 0.5)",
  };

  const lightColors = {
    "*": "rgba(200,200,200,0.3)",
    "D/L": "rgba(200,200,200,0.3)",
    "GUA": "rgba(250, 117, 100, 0.3)",
    "ESM": "rgba(250,200,100,0.3)",
    default: "rgba(220,220,220,0.1)",
  };

  return {
    ...baseStyle,
    backgroundColor: (isDarkMode ? darkColors : lightColors)[activityUpper] 
      || (isDarkMode ? darkColors.default : lightColors.default),
  };
};
