import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },

  // ✨ Info del día
  infoBox: {
    flex: 1,
    padding: 6,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
  },
  empty: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },

  flightInfo: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },

  checkinContainer: {
    backgroundColor: 'rgba(103, 58, 183, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  checkinText: {
    color: '#673ab7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 🕒 Timeline de horas
  timelineContainer: {
    marginTop: 6,
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
    width: "23.5%", // 4 bloques por fila
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: "0.75%",
    borderRadius: 6,
  },
  inactiveBlock: {
    backgroundColor: "#f0f0f0",
  },
  activeBlock: {
    backgroundColor: "#afa84c",
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 13,
    color: "#333",
  },
});
