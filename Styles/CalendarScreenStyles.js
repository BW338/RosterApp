import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // fondo más suave
  },

  // ✨ Info del día
  infoBox: {
    flex: 1,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  empty: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },

  // 🕒 Timeline de horas
  timelineContainer: {
    marginTop: 20,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#444",
  },
  timeline: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hourBlock: {
    width: "12.5%", // 8 bloques por fila (24h)
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    borderRadius: 6,
  },
  inactiveBlock: {
    backgroundColor: "#f0f0f0",
  },
  activeBlock: {
    backgroundColor: "#afa84caa", // verde más suave con opacidad
  },
  hourLabel: {
    fontSize: 10,
    color: "#555",
  },

  // 🟦 Día libre
  freeDayBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#e6f7ff",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  freeDayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0077b6",
  },

  // 🟩 Leyenda colores
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 13,
    color: "#333",
  },
});
