import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "#f9f9f9",
  },
  // Info del día
  infoBox: {
    flex: 1,
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#2007b1ff",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
    lineHeight: 22,
    textAlign: "left",
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

  // Contenedor para los horarios checkin/fin (versión antigua)
  timeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(103, 58, 183, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    maxWidth: 200,
  },
  timeInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#673ab7',
  },
  timeInfoSeparator: {
    fontSize: 16,
    fontWeight: '400',
    color: '#673ab7',
    marginHorizontal: 8,
  },
  timeInfoLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    maxWidth: 200,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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

  // Detalles de vuelos
  flightDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#673ab7",
  },
  flightDetailsText: {
    flex: 1, // Permite que el texto se ajuste si es largo
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
    paddingRight: 8, // Espacio para que no se pegue a la duración
  },
  flightDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: '#673ab7',
  },
  flightDurationDark: {
    color: '#AECBFA',
  },

  // Timeline de horas
  timelineContainer: {
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#444",
    textAlign: "center",
  },
  timeline: {
    padding: 6,
  },
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  hourBlock: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    borderRadius: 6,
  },
  inactiveBlock: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  activeBlock: {
    backgroundColor: "#ff8a80",
    borderWidth: 1,
    borderColor: "#ff5722",
    shadowColor: "#ff5722",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  hourLabel: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  timelineBlockLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#555',
    textTransform: 'uppercase',
  },
  hourLabelSpecial: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Día libre
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

  // NUEVOS ESTILOS PARA HEADER HORIZONTAL
  dayHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#673ab7",
  },
  dayTitleSection: {
    flex: 1,
    paddingRight: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    lineHeight: 24,
    textAlign: "left",
    flexShrink: 1, // Permite que el texto se encoja si no hay espacio
  },
  timeInfoSection: {
    alignItems: 'flex-end',
  },
  // Estilos para TSV y TTEE
  serviceTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16, // Espacio entre TSV y TTEE
    marginTop: 6, // Espacio respecto al título principal
  },
  serviceTimesContainerDark: {
    // No necesita un fondo oscuro si está dentro del header
  },
  
  // Horarios horizontales (nueva versión)
  timeInfoHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(103, 58, 183, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timeColumn: {
    alignItems: 'center',
    minWidth: 55,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#673ab7',
  },
  timeLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 12,
  },

  // Estilos antiguos del título (mantenidos por compatibilidad)
  dayTitleContainer: {
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#673ab7",
  },
  activitySymbol: {
    fontSize: 20,
    marginRight: 8,
  },
  
  // Contenedor para horarios en el título (versión antigua)
  titleTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(103, 58, 183, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  titleTimeColumn: {
    alignItems: 'center',
    minWidth: 65,
  },
  titleTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#673ab7',
    textAlign: 'center',
  },
  titleTimeSeparator: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  titleTimeLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 3,
    textTransform: 'uppercase',
  },

  // Nuevos estilos para mejor organización
  dayInfoSection: {
    marginBottom: 16,
  },
  
  flightListContainer: {
    marginTop: 10,
    marginBottom: 16,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  // --- Dark Mode Styles ---
  infoBoxDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#272729',
  },
  dayHeaderContainerDark: {
    backgroundColor: '#2C2C2E',
    borderLeftColor: '#AECBFA',
  },
  dayTitleDark: {
    color: '#FFFFFF',
  },
  timeValueDark: {
    color: '#AECBFA',
  },
  timeLabelDark: {
    color: '#8E8E93',
  },
  flightDetailsContainerDark: {
    backgroundColor: '#2C2C2E',
    borderLeftColor: '#AECBFA',
  },
  flightDetailsTextDark: {
    color: '#EAEAEA',
  },
  timelineContainerDark: {
    borderColor: '#48484A',
    backgroundColor: '#1C1C1E',
  },
  inactiveBlockDark: {
    backgroundColor: '#3A3A3C',
    borderColor: '#545458',
  },
  activeBlockDark: {
    backgroundColor: '#004A7F', // Un azul oscuro para el modo noche
    borderColor: '#AECBFA',
    shadowColor: '#AECBFA',
  },
  hourLabelDark: {
    color: '#EAEAEA',
  },
  timelineBlockLabelDark: {
    color: '#8E8E93',
  },
  emptyDark: {
    color: '#8E8E93',
  },
  // --- Floating Preview Bubble Styles ---
  floatingPreviewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  floatingPreviewBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '100%',
  },
  floatingPreviewBubbleDark: {
    backgroundColor: '#3A3A3C',
  },
  floatingPreviewText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  floatingPreviewTextDark: {
    color: '#FFFFFF',
  },
});