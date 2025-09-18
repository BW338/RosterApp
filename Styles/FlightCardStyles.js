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
  cardDark: {
    backgroundColor: "#2C2C2E", // Un gris más claro para que contraste con el fondo
    borderColor: '#48484A', // Un borde sutil para definir la tarjeta
    shadowColor: '#000',
    shadowOpacity: 0.6,
  },
  textDark: {
    color: '#EAEAEA',
  },
  textDarkMuted: {
    color: '#9E9E9E',
  },
  route: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f285a",
  },
  routeDark: {
    color: '#D0D0D0',
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
  durationDark: {
    color: '#81b0ff',
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
  specialActivityDark: {
    color: '#EAEAEA',
  },
  guaActivity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff0000ff",
  },
  guaActivityDark: {
    color: '#FF453A',
  },
  dlActivity:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#00813aff",
  },
  dlActivityDark: {
    color: '#32D74B',
  }
});
