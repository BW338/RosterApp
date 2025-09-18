// Styles/CalculatorStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent", // Hacemos el fondo transparente para que se vea la imagen
    paddingTop: 50,
    justifyContent: "space-between",
    alignItems: 'center',
  },
  inputSection: {
    width: '100%',
    marginTop: 50, // Aumentamos el margen para bajar los inputs
    paddingHorizontal:20,
  },

  // Fila de los relojes (Checkin, ETD, ETA)
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    marginVertical: 12,
  },

  // Fila combinada para ETD y ETA
  rowCombined: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },

  // Contenedor para cada input de hora (icono + texto)
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 12,
    color: "#1c1c1e",
    backgroundColor: "#A9DFBF", // verde claro
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    textAlign: "center",
    minWidth: 120,
  },

  timeTextSmall: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1c1c1e',
    backgroundColor: '#A9DFBF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    textAlign: 'center',
    minWidth: 90,
  },

  // Caja de resultados (ULT-ETA, TSV, TT EE, FLEX)
  results: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 25, // Aumentamos el margen para bajar los carteles
    width: '100%',
    gap: 10,
    paddingHorizontal: 20,
  },

  resultBox: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 1.5,
    borderColor: "#555",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    margin: 5,
    width: 120, // Reducimos el ancho
    alignItems: "center",
    justifyContent: 'center',
    minHeight: 95, // Aseguramos una altura mínima
  },

  resultText: {
    fontSize: 16, // Reducimos el tamaño de la fuente
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },

  resultLabel: {
    fontSize: 11, // Reducimos el tamaño de la etiqueta
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 3,
  },

  // Footer con botones (tipo toolbar inferior)
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingVertical:6, // Reducimos el padding vertical
    paddingBottom: 6, // Reducimos el padding inferior para achicarlo
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#0000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },

  footerButton: {
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
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
  modalText: {
    fontSize: 16,
    marginVertical: 4,
  },
});
