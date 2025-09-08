import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop:28,
    backgroundColor: "#f9f9f963",
  },
  // ✨ Info del día
  infoBox: {
    flex: 1,
    padding: 6,
    borderTopWidth: 1,
    borderColor: "#2007b1ff",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
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
    fontSize: 18,
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
    borderWidth: 0.5,
    borderRadius:8,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom:10,
    color: "#444",
  },
  timeline: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hourBlock: {
    width: "14%", // 4 bloques por fila
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
    backgroundColor: "#ff9790ff",
  },
  hourLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700"
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
});
