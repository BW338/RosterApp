import { StyleSheet } from 'react-native';

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
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#E5E5EA',
    paddingVertical: 14,
    borderRadius: 10,
  },
  closeButtonDark: {
    backgroundColor: '#3A3A3C',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButtonTextDark: {
    color: '#AECBFA',
  },
});