import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  infoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  infoModalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoModalContentDark: {
    backgroundColor: '#2C2C2E',
  },
  infoModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoModalTitleDark: {
    color: '#FFFFFF',
  },
  infoModalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  infoModalTextDark: {
    color: '#EAEAEA',
  },
  legendContainer: {
    marginTop: 15,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 15,
  },
  legendLabel: {
    fontSize: 16,
    color: '#333',
  },
  legendLabelDark: {
    color: '#FFFFFF',
  },
  infoModalButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  infoModalButtonDark: {
    backgroundColor: '#AECBFA',
  },
  infoModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoModalButtonTextDark: {
    color: '#1C1C1E',
  },
});
