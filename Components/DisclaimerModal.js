import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/DisclaimerStyles';

const DisclaimerModal = ({ visible, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);
  
  const handleAccept = async () => {
    if (dontShowAgain) {
      try {
        await AsyncStorage.setItem('disclaimer_accepted', 'true');
      } catch (e) {
        console.error("Fallo al guardar la preferencia del disclaimer.", e);
      }
    }
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleAccept}
      statusBarTranslucent={true} // Para mejor integración en Android
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Contenedor del ícono con fondo */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name="shield-checkmark-outline" 
              size={48} 
              color="#3983f1" 
            />
          </View>
          
          <Text style={styles.modalTitle}>Aviso Importante</Text>
          <Text style={styles.modalSubtitle}>
            Información sobre el uso de la aplicación
          </Text>
          
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <Text style={styles.disclaimerText}>
              Esta aplicación fue creada de manera independiente para ayudarte a organizar tu trabajo de forma más simple.
              {'\n\n'}
              <Text style={styles.bold}>• No pertenece ni está vinculada</Text> a ninguna aerolínea ni compañía aérea.
              {'\n\n'}
              <Text style={styles.bold}>• Toda la información</Text> que ves en la app proviene únicamente de los archivos que vos mismo cargás (por ejemplo, tu plan de vuelo en PDF).
              {'\n\n'}
              <Text style={styles.bold}>• Los datos se procesan y guardan </Text>
              <Text style={styles.highlight}>sólo en tu dispositivo</Text>: no se comparten ni almacenan en servidores externos.
              {'\n\n'}
              <Text style={styles.bold}>• El uso de la app</Text> es voluntario y queda bajo tu responsabilidad.
            </Text>
          </ScrollView>

          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
              thumbColor={dontShowAgain ? "#3983f1" : "#f3f4f6"}
              ios_backgroundColor="#d1d5db"
              onValueChange={setDontShowAgain}
              value={dontShowAgain}
            />
            <Text style={styles.switchLabel}>No volver a mostrar este aviso</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.acceptButton,
              styles.accessibleButton,
              buttonPressed && styles.acceptButtonPressed
            ]}
            onPress={handleAccept}
            onPressIn={() => setButtonPressed(true)}
            onPressOut={() => setButtonPressed(false)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Acepto los términos y continuar"
          >
            <Text style={styles.acceptButtonText}>Acepto y Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DisclaimerModal;