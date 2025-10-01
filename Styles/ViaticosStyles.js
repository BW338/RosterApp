import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Estilos que reemplazan a GlobalStyles
  fondoViaticos: { 
    flex: 1, 
    resizeMode: "cover", 
    justifyContent: "flex-start", 
    alignItems: "center",
    paddingTop: 10, // Espacio superior para que no esté pegado
  },
  tituloViaticos: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "white", 
    textAlign: "center", 
    marginVertical: 15, 
    textShadowColor: "#000", 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 4 
  },
  ModalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#85C1E9",
    width: '85%',
  },
  escalas: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginRight: 5, 
    alignSelf: 'center' 
  },
  modalInputContainer: {
    width: '100%',
    gap: 12,
  },
  modalInputRow: { flexDirection: 'row', alignItems: 'center' },
  valorEscalas$: { 
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 6, 
    paddingHorizontal: 8, 
    height: 35, 
    fontSize: 16 
  },
  CerrarModal: { 
    marginTop: 20 
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '95%',
    marginTop: 10,
    flex: 1,
    marginBottom: 10,
    gap: 10,
  },
  
  // --- Estilos para el nuevo contador de montos ---
  summaryBoxLeft: {
    width: '36%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    marginLeft: 8,
    paddingVertical: 5,
    borderWidth: 1,
    paddingLeft:12,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'space-between',
  },
  summaryRow: {
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalViaticosContainer: {
    marginTop: 'auto', // Empuja el total hacia abajo
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  totalLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#AECBFA', // Un azul claro para destacar
    marginTop: 0,
  },

  // --- Estilos para el Calendario ---
  calendarWrapper: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10, // Margen superior para separar del título
  },
  calendarStyle: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  calendarTheme: {
    calendarBackground: "transparent",
    monthTextColor: "#FFFFFF",
    textMonthFontSize: 20,
    textMonthFontWeight: "bold",
    arrowColor: "#FFFFFF",
    dayTextColor: "#FFFFFF",
    textDisabledColor: "rgba(255, 255, 255, 0.5)",
    textSectionTitleColor: "rgba(255, 255, 255, 0.8)",
    textDayFontSize: 14,
  },

  almanaque: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32, // Se mantiene el tamaño para no afectar el click
    borderRadius: 16, // Se mantiene el tamaño para no afectar el click
    borderWidth:2,
    borderColor: '#000',
  },
  dayText: {
    fontSize: 16,
    color: 'black',
  },
  // --- Estilos para el Dropdown de Postas ---
  dropdown: {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectedTextStyle: {
    fontSize:16,
    color: '#FFFFFF',
  },
  dropdownContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownItemContainer: {
    paddingVertical: 2, // Reducimos el padding vertical
    paddingHorizontal: 15,
    borderBottomWidth: 1, // Añadimos un borde inferior
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Color sutil para el borde
  },
  itemTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#2C2C2E',
    borderColor: '#48484A',
    color: '#FFFFFF',
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  // --- Estilos para la lista de Postas seleccionadas ---
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding:2,
    borderRadius: 10,
    marginTop: 8,
  },
  itemLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  FlatList:{
    borderRadius: 8,
    padding: 3,
    marginTop:6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro para contraste
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Borde más sutil
  }, 
  modalTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postasContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  // --- Header Styles ---
header: {
  backgroundColor: '#ffffff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
  borderColor: "#000",
  height: 50, // Ajustamos la altura del header
  borderWidth:1,
},
headerTitle: {
  color: '#111827',
  fontSize: 20,
  fontWeight: '700',
  letterSpacing: 0.5,
},
headerRightContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 12,
  gap: 8,
},
headerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 20, // más pill shape
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},
valoresButton: {
  borderColor: '#86efac', // verde claro
  backgroundColor: '#dcfce7', // verde muy suave
},
resetButton: {
  borderColor: '#fca5a5', // rojo claro
  backgroundColor: '#fee2e2', // rojo muy suave
},
headerButtonText: {
  marginLeft: 6,
  fontWeight: '600',
  fontSize: 14,
},
valoresText: {
  color: '#15803d',
},
resetText: {
  color: '#dc2626',
},

});