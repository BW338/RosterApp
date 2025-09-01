export const getActivityStyle = (activity) => {
  if (!activity) return {};

  const activityUpper = activity.toUpperCase();

  switch (activityUpper) {
    case "*":
      return { backgroundColor: "rgba(200,200,200,0.3)", padding: 6, borderRadius: 6 };
    case "GUA":
      return { backgroundColor: "rgba(250, 117, 100, 0.3)", padding: 6, borderRadius: 6 };
    case "ESM":
      return { backgroundColor: "rgba(250,200,100,0.3)", padding: 6, borderRadius: 6 };
    default:
      return { backgroundColor: "rgba(220,220,220,0.1)", padding: 6, borderRadius: 6 };
  }
};
