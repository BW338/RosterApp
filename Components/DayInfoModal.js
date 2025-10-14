import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateLastLanding, calculateFlexHours } from '../Helpers/flightCalculations';
import styles from '../Styles/DayInfoModalStyles'; // Importamos los estilos
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente reutilizable para mostrar una fila de información
const InfoRow = ({ icon, label, value, isDarkMode, valueColor }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={22} color={isDarkMode ? '#AECBFA' : '#007AFF'} style={styles.infoIcon} />
    <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>{label}:</Text>
    <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark, valueColor && { color: valueColor }]}>{value}</Text>
  </View>
);

const DayInfoModal = ({ visible, onClose, dayData, isDarkMode }) => {
  const [flexValue, setFlexValue] = useState(0);

  useEffect(() => {
    const loadFlexValue = async () => {
      if (visible) { // Solo cargar cuando el modal es visible
        try {
          const storedData = await AsyncStorage.getItem("calendarDataFlex");
          if (storedData) {
            const { valorHr } = JSON.parse(storedData);
            setFlexValue(valorHr || 0);
          }
        } catch (error) {
          console.log("Error al cargar valor flex:", error);
        }
      }
    };
    loadFlexValue();
  }, [visible]);

  if (!dayData) {
    return null;
  }

  // Formateamos la fecha completa en español
  const formattedDate = new Date(dayData.fullDate).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Obtenemos los horarios de los vuelos
  const firstDeparture = dayData.flights?.[0]?.depTime;
  const lastArrival = dayData.flights?.[dayData.flights.length - 1]?.arrTime;

  // Calculamos la ruta del vuelo si es un día de vuelo
  const isFlightDay = dayData.flights && dayData.flights.length > 0 && dayData.flights[0].flightNumber;
  let flightRoute = null;
  if (isFlightDay) {
    flightRoute = [dayData.flights[0].origin, ...dayData.flights.map(f => f.destination)].join(' - ');
  }

  const lastLanding = calculateLastLanding(dayData.checkin);
  
  // Lógica mejorada para TSV:
  // Solo buscamos en el día siguiente si el día actual es un día de vuelo.
  let effectiveTsv = dayData.tsv;
  if (!effectiveTsv && isFlightDay) {
    effectiveTsv = dayData.nextDay?.tsv;
  }

  const te = effectiveTsv ? require('../Helpers/today').subtractMinutes(effectiveTsv, 30) : null;
  const flexHours = calculateFlexHours(te);
  const flexMoney = flexHours > 0 && flexValue > 0 ? flexHours * flexValue : 0;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, isDarkMode && styles.modalViewDark]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#999" />
          </TouchableOpacity>

          <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>Resumen del Vuelo</Text>

          {/* Ruta del Vuelo */}
          {flightRoute && (
            <View style={[styles.routeContainer, isDarkMode && styles.routeContainerDark]}>
              <Ionicons name="swap-horizontal-outline" size={20} color={isDarkMode ? '#AEAEB2' : '#555'} />
              <Text style={[styles.routeText, isDarkMode && styles.routeTextDark]}>{flightRoute}</Text>
            </View>
          )}

          <InfoRow icon="calendar-outline"  value={capitalizedDate} isDarkMode={isDarkMode} />
          {dayData.checkin && <InfoRow icon="log-in-outline" label="Check-in" value={dayData.checkin} isDarkMode={isDarkMode} />}

          {/* Horarios de Vuelo */}
          {(firstDeparture || lastArrival) && (
            <View style={styles.timeRow}>
              <InfoRow icon="airplane-outline" label="Dep" value={firstDeparture || 'N/A'} isDarkMode={isDarkMode} />
              <InfoRow icon="airplane" label="Arr" value={lastArrival || 'N/A'} isDarkMode={isDarkMode} />
            </View>
          )}

          {/* Tiempos de Servicio */}
          {(effectiveTsv || te) && (
            <View style={styles.timeRow}>
              <InfoRow icon="time-outline" label="TSV" value={effectiveTsv || 'N/A'} isDarkMode={isDarkMode} />
              <InfoRow icon="timer-outline" label="TTEE" value={te || 'N/A'} isDarkMode={isDarkMode} />
            </View>
          )}

          {/* Último Aterrizaje */}
          {lastLanding && (
            <View style={[styles.lastLandingContainer, isDarkMode && styles.lastLandingContainerDark]}>
              <InfoRow icon="warning-outline" label="Último Aterrizaje" value={lastLanding} isDarkMode={isDarkMode} valueColor={isDarkMode ? '#FFD54F' : '#B8860B'} />
            </View>
          )}

          {/* Horas Flex */}
          {flexHours > 0 && (
            <View style={[styles.flexContainer, isDarkMode && styles.flexContainerDark]}>
              <InfoRow 
                icon="add-circle-outline" 
                label={`${flexHours}hs Flex`} 
                value={flexMoney > 0 ? `$${flexMoney}` : ''} isDarkMode={isDarkMode} valueColor={isDarkMode ? '#70E0F5' : '#007B8C'} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DayInfoModal;