import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/EmptyRosterStyles';

const EmptyRoster = ({ navigation, isDarkMode }) => {
  const containerStyle = [
    styles.container,
    isDarkMode && styles.containerDark,
  ];
  const titleStyle = [styles.title, isDarkMode && styles.titleDark];
  const subtitleStyle = [styles.subtitle, isDarkMode && styles.subtitleDark];
  const buttonStyle = [styles.button, isDarkMode && styles.buttonDark];
  const buttonTextStyle = [styles.buttonText, isDarkMode && styles.buttonTextDark];
  const iconColor = isDarkMode ? '#AECBFA' : '#007AFF';

  return (
    <View style={containerStyle}>
      <Ionicons name="cloud-upload-outline" size={80} color={iconColor} style={styles.icon} />
      <Text style={titleStyle}>Tu plan de vuelo te espera</Text>
      <Text style={subtitleStyle}>
        Cargá tu roster en PDF para ver tus vuelos, horarios y actividades de forma organizada.
      </Text>
      <TouchableOpacity 
        style={buttonStyle} 
        onPress={() => {
          // Navegamos a la pantalla del panel de roster y le pasamos un parámetro
          // para que inicie la selección de archivos automáticamente.
          navigation.navigate('Roster', { screen: 'RosterPannel', params: { autoPick: true } });
        }}
      >
        <Text style={buttonTextStyle}>Cargar Roster PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyRoster;