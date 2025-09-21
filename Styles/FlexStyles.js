import { StyleSheet } from "react-native";

export default StyleSheet.create({
  fondoViaticos: { flex: 1, resizeMode: "cover", justifyContent: "flex-start", alignItems: "center", marginTop:0 },
  tituloFlex: { fontSize: 28, fontWeight: "bold", color: "white", textAlign: "center", marginVertical: 24, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  
  calendarStyle: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 7,
    marginTop:20,
  },
  calendarTheme: {
    monthTextColor: "#008b8b",
    textMonthFontSize: 24,
    textMonthFontWeight: "bold",
    arrowColor: "pink",
    arrowHeight: 60,
    arrowWidth: 60,
    calendarBackground: "black",
    dayTextColor: "white",
    textInactiveColor: "red",
    textSectionTitleColor: "#008b8b",
    textDayFontSize: 20,
    textDisabledColor: "grey",
  },

  text: { color: "white", borderWidth: 3, borderColor: "white", textAlign: "center", fontWeight: "bold", borderRadius: 10, padding: 9, marginHorizontal: 5, backgroundColor: "black", marginTop: 16, fontSize: 18 },
  textMonth: { fontWeight: "bold", fontStyle: "italic", textTransform: "uppercase", backgroundColor: 'transparent', borderWidth: 0 },
  totalHr: { color: "black", backgroundColor: "lightgrey", fontWeight: "bold", fontSize: 24, paddingHorizontal: 8, borderRadius: 5, overflow: 'hidden' },
  
  // Contenedor de cálculos
  calculationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  sumacontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7cfc00',
    marginTop:6,
  },
    valorcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: 'rgba(216, 213, 213, 0.18)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00000065',
    marginTop:6,
  },
  sumatext: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
    valortext: {
    color: '#474747d7',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
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
  almanaque: { alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#000" },
  dayText: { fontSize: 16 },
});