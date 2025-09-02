import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 8,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  route: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f285a",
  },
  flightNumber: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
    marginVertical: 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  time: {
    fontSize: 16,
    color: "#161616ff",
  },
  checkout: {
    fontSize: 14,
    color: "#555",
    marginLeft: 6, // 🔹 separa del arrTime
  },
  duration: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0032d6ff",
  },
  aircraft: {
    fontSize: 14,
    color: "#777",
    marginTop: 0,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
  },
  lastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  totals: {
    fontSize: 13,
  },

  // 🔹 estilos para actividades especiales
  specialActivity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  guaActivity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff0000ff",
  },
  dlActivity:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#00813aff",
  }
});
