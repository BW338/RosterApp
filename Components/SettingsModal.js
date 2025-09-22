import React from 'react';
import { Modal, View, Text, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/SettingsModalStyles';

const COLOR_OPTIONS = ['#FFD54F', '#AECBFA', '#90EE90', '#FFB6C1', '#FF6347'];

const SettingsModal = ({
  visible,
  onClose,
  isDarkMode,
  setIsDarkMode,
  todayColor,
  setTodayColor,
}) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]} onStartShouldSetResponder={() => true}>
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>Configuración</Text>
          
          {/* Section: Apariencia */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Apariencia</Text>
            <View style={[styles.optionRow, isDarkMode && styles.optionRowDark]}>
              <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={isDarkMode ? '#AECBFA' : '#FFC300'} />
              <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>Modo Oscuro</Text>
              <Switch 
                value={isDarkMode} 
                onValueChange={setIsDarkMode} 
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={"#f4f3f4"}
              />
            </View>
          </View>

          {/* Section: Roster */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Roster</Text>
            <View style={[styles.optionRow, isDarkMode && styles.optionRowDark]}>
              <Ionicons name="today-outline" size={24} color={isDarkMode ? '#FFF' : '#000'} />
              <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>Color del día "Hoy"</Text>
            </View>
            <View style={styles.colorPickerContainer}>
              {COLOR_OPTIONS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color, borderWidth: todayColor === color ? 2 : 0 }]}
                  onPress={() => setTodayColor(color)}
                >
                  {todayColor === color && <Ionicons name="checkmark" size={20} color="white" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={[styles.closeButton, isDarkMode && styles.closeButtonDark]} onPress={onClose}>
            <Text style={[styles.closeButtonText, isDarkMode && styles.closeButtonTextDark]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SettingsModal;