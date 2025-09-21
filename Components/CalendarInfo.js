import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import styles from '../Styles/CalendarInfoStyles';

const CalendarInfo = ({ visible, onClose, isDarkMode, legendItems }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.infoModalContainer}>
        <View style={[styles.infoModalContent, isDarkMode && styles.infoModalContentDark]}>
          <Text style={[styles.infoModalTitle, isDarkMode && styles.infoModalTitleDark]}>
            Acerca del Calendario
          </Text>
          <Text style={[styles.infoModalText, isDarkMode && styles.infoModalTextDark]}>
            Este calendario resalta automáticamente tus días de actividad según la información de tu roster.
          </Text>
          <Text style={[styles.infoModalText, isDarkMode && styles.infoModalTextDark]}>
            Los colores te ayudan a identificar rápidamente el tipo de actividad programada:
          </Text>

          <View style={styles.legendContainer}>
            {legendItems.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, isDarkMode && styles.legendLabelDark]}>{item.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.infoModalButton, isDarkMode && styles.infoModalButtonDark]}
            onPress={onClose}
          >
            <Text style={[styles.infoModalButtonText, isDarkMode && styles.infoModalButtonTextDark]}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarInfo;
