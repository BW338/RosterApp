// Styles/CalculatorStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5DADE2", // azul cielo de fondo
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: "space-between",
  },

  // Fila de los relojes (Checkin, ETD, ETA)
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },

  timeText: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 12,
    color: "#2c3e50",
    backgroundColor: "#A9DFBF", // verde claro
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    textAlign: "center",
    minWidth: 90,
  },

  // Caja de resultados (ULT-ETA, TSV, TT EE, FLEX)
  results: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  resultBox: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 8,
    minWidth: 110,
    alignItems: "center",
  },

  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },

  resultLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // Footer con botones (tipo toolbar inferior)
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  footerButton: {
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: "#333",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2E86C1",
  },
});
