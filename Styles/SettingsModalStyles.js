import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: height * 0.85, // El modal no ocupará más del 85% de la altura
    backgroundColor: '#FFFFFF', 
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentDark: {
    backgroundColor: '#2C2C2E',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 24,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingLeft: 16,
  },
  sectionTitleDark: {
    color: '#8E8E93',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  optionRowDark: {
    backgroundColor: '#3A3A3C',
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    color: '#1C1C1E',
    marginLeft: 16,
  },
  optionTextDark: {
    color: '#FFFFFF',
  },
  // --- Estilos para la fila de vista previa ---
  colorPreviewRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: -16, // Truco para que ocupe todo el espacio del 'optionRow'
    borderRadius: 10,
  },
  colorPreviewRowText: {
    flex: 1,
    fontSize: 17,
    color: '#000',
    marginLeft: 16,
    fontWeight: '600', // Un poco más de peso para que se lea bien
  },
  // --- Estilos para la Rueda de Colores ---
  colorWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    height: 180, // Altura fija para contener la rueda
  },
  colorWheel: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOption: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: 'white',
    transform: [{ scale: 1.1 }],
    elevation: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1, // Asegura que esté por encima del contenido
    padding: 4,
  },
  // --- Estilos para el selector de pantalla de inicio ---
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  selectorOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    margin: 4,
  },
  selectorOptionDark: {
    backgroundColor: '#555',
  },
  selectorOptionActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  selectorText: {
    color: '#000',
    fontWeight: '500',
  },
  selectorTextDark: {
    color: '#FFF',
  },
  selectorTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});