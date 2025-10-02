import React from 'react';
import { Modal, View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/SettingsModalStyles';

const COLOR_OPTIONS = [
  '#FFD54F', // Amarillo
  '#AECBFA', // Azul claro
  '#90EE90', // Verde claro
  '#FFB6C1', // Rosa
  '#FF6347', // Tomate
  '#BA55D3', // Orquídea
  '#40E0D0', // Turquesa
  '#FFA07A', // Salmón claro
];
const WHEEL_RADIUS = 70; // Radio de la rueda de colores

const SettingsModal = ({
  visible,
  onClose,
  isDarkMode,
  setIsDarkMode,
  todayColor,
  setTodayColor,
  initialScreen,
  setInitialScreen,
  onOpenInfo,
}) => {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]} onStartShouldSetResponder={() => true}>
          {/* Botón de cierre (X) en la esquina superior derecha */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color={isDarkMode ? '#555' : '#ccc'} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            
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
            {setTodayColor && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Roster</Text>
                <View style={[styles.optionRow, isDarkMode && styles.optionRowDark]}>
                  {/* El fondo de este renglón cambiará de color */}
                  <View style={[styles.colorPreviewRow, { backgroundColor: todayColor }]}>
                    <Ionicons name="today-outline" size={24} color="#000" />
                    <Text style={styles.colorPreviewRowText}>Color del día "Hoy"</Text>
                  </View>
                </View>
                {/* Rueda de Colores */}
                <View style={styles.colorWheelContainer}>
                  <View style={styles.colorWheel}>
                    {COLOR_OPTIONS.map((color, index) => {
                      const angle = (index / COLOR_OPTIONS.length) * 2 * Math.PI;
                      const x = WHEEL_RADIUS * Math.cos(angle);
                      const y = WHEEL_RADIUS * Math.sin(angle);
                      const isSelected = todayColor === color;

                      return (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color, transform: [{ translateX: x }, { translateY: y }] },
                            isSelected && styles.colorOptionSelected
                          ]}
                          onPress={() => setTodayColor(color)}
                        />
                      );
                    })}
                  </View>
                </View>
            </View>
            )}

            {/* Section: Pantalla de Inicio */}
            {setInitialScreen && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>General</Text>
                <View style={[styles.optionRow, isDarkMode && styles.optionRowDark, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                  <Text style={[styles.optionText, isDarkMode && styles.optionTextDark, { marginLeft: 0, marginBottom: 8 }]}>Pantalla de Inicio</Text>
                  <View style={styles.selectorContainer}>
                    {['Roster', 'Calendario', 'Calculador'].map((screen) => (
                      <TouchableOpacity
                        key={screen}
                        style={[
                          styles.selectorOption,
                          isDarkMode && styles.selectorOptionDark,
                          initialScreen === screen && styles.selectorOptionActive,
                        ]}
                        onPress={() => setInitialScreen(screen)}
                      >
                        <Text style={[ styles.selectorText, isDarkMode && styles.selectorTextDark, initialScreen === screen && styles.selectorTextActive ]}>
                          {screen}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Section: Ayuda (condicional) */}
            {onOpenInfo && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Ayuda</Text>
                <TouchableOpacity 
                  style={[styles.optionRow, isDarkMode && styles.optionRowDark]}
                  onPress={onOpenInfo}
                >
                  <Ionicons name="information-circle-outline" size={24} color={isDarkMode ? '#AECBFA' : '#007AFF'} />
                  <Text style={[styles.optionText, isDarkMode && styles.optionTextDark]}>Guía de Uso</Text>
                  <Ionicons name="chevron-forward-outline" size={20} color={isDarkMode ? '#8E8E93' : '#C7C7CD'} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SettingsModal;