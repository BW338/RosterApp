import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tituloFlex: { fontSize: 28, fontWeight: "bold", color: "white", textAlign: "center", marginVertical: 24, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  
  calendarStyle: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // Se quita el margen horizontal para que el calendario ocupe todo el ancho del contenedor.
  },
  calendarTheme: {
    calendarBackground: "transparent",
    monthTextColor: "#FFFFFF",
    textMonthFontSize: 20,
    textMonthFontWeight: "bold",
    arrowColor: "#FFFFFF",
    dayTextColor: "white",
    textDisabledColor: "rgba(255, 255, 255, 0.5)",
    textSectionTitleColor: "rgba(255, 255, 255, 0.8)",
    textDayFontSize: 14,
  },
  calendarWrapper: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },

  text: { color: "white", borderWidth: 3, borderColor: "white", textAlign: "center", fontWeight: "bold", borderRadius: 10, padding: 9, marginHorizontal: 5, backgroundColor: "black", marginTop: 16, fontSize: 18 },
  textMonth: { fontWeight: "bold", fontStyle: "italic", textTransform: "uppercase", backgroundColor: 'transparent', borderWidth: 0, color: '#AECBFA' },
  totalHr: { color: "black", backgroundColor: "lightgrey", fontWeight: "bold", fontSize: 24, paddingHorizontal: 8, borderRadius: 5, overflow: 'hidden' },
  
  // Contenedor de cálculos
  calculationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footer: {
    padding: 15,
    paddingBottom: 25, // Más espacio en la parte inferior
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sumacontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7cfc00',
  },
    valorcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: 'rgba(216, 213, 213, 0.18)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00000065',
  },
  sumatext: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
    valortext: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  valorHrValue: {
    color: '#7cfc00', // Verde lima para resaltar
    fontSize: 18,
    fontWeight: 'bold',
  },
  sumaFlex: { 
    fontSize: 20, 
    fontWeight: "bold"
    , color: "white",
     marginTop: 12,
      textShadowColor: "rgba(230, 229, 229, 1)",
       textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },

  // Modal Valor Hora
  modalContainer: { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalView: { backgroundColor: "white", marginHorizontal: 20, padding: 20, borderRadius: 16, borderWidth: 2, borderColor: "#85C1E9", width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16, color: "#333" },
  modalInputRow: { flexDirection: "row", alignItems: "center" },
  modalCurrency: { fontSize: 20, fontWeight: "bold", marginRight: 5 },
  modalInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, height: 40, fontSize: 18 },
  modalButtonContainer: { marginTop: 20 },

  // Estilos del día en el calendario
  almanaque: { alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#000" }, // Este borde negro se sobreescribe por el color de la actividad
  dayText: { fontSize: 16, color: 'black' }, // El color del texto del día se maneja en Flex.js
});