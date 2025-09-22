import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Overlay más oscuro para mejor contraste
    paddingHorizontal: 16,
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 24, // Bordes más redondeados y modernos
    padding: 28,
    alignItems: 'center',
    width: width > 768 ? '60%' : '92%', // Responsivo para tablets
    maxHeight: height * 0.85,
    maxWidth: 500, // Límite máximo en pantallas grandes
    // Sombras mejoradas para iOS y Android
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 8 
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(57, 131, 241, 0.1)', // Fondo sutil para el ícono
    borderRadius: 50,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700', // Peso más fuerte
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5, // Spacing más moderno
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  scrollView: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  disclaimerText: {
    fontSize: 16,
    lineHeight: 24, // Mejor legibilidad
    color: '#444',
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  bold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  highlight: {
    backgroundColor: 'rgba(57, 131, 241, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
    color: '#3983f1',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa', // Fondo sutil
    borderRadius: 12,
    marginBottom: 24,
  },
  switchLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
    flex: 1,
  },
  acceptButton: {
    backgroundColor: '#3983f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    // Sombra para el botón
    shadowColor: '#3983f1',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  // Estados adicionales para mejor UX
  acceptButtonPressed: {
    backgroundColor: '#2968d1', // Color más oscuro al presionar
    transform: [{ scale: 0.98 }],
  },
  // Estilos para modo oscuro (opcional)
  darkMode: {
    modalView: {
      backgroundColor: '#1e1e1e',
    },
    modalTitle: {
      color: '#ffffff',
    },
    modalSubtitle: {
      color: '#cccccc',
    },
    disclaimerText: {
      color: '#e0e0e0',
    },
    switchContainer: {
      backgroundColor: '#2a2a2a',
    },
    switchLabel: {
      color: '#e0e0e0',
    },
  },
  // Animaciones y transiciones
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
  // Mejoras para accesibilidad
  accessibleButton: {
    minHeight: 48, // Tamaño mínimo recomendado para toques
  },
  accessibleText: {
    minHeight: 20, // Altura mínima para texto legible
  },
});