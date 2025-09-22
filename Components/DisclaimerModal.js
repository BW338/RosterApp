import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DisclaimerModal = ({ visible, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(true); 

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
      onRequestClose={handleAccept} // Permite cerrar con el botón de atrás en Android
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Ionicons name="shield-checkmark-outline" size={48} color="#3983f1" style={{ marginBottom: 15 }} />
          <Text style={styles.modalTitle}>Aviso Importante</Text>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.disclaimerText}>
              Esta aplicación fue creada de manera independiente para ayudarte a organizar tu trabajo de forma más simple.
              {'\n\n'}
              No pertenece ni está vinculada a ninguna aerolínea ni compañía aérea.
              {'\n\n'}
              Toda la información que ves en la app proviene únicamente de los archivos que vos mismo cargás (por ejemplo, tu plan de vuelo en PDF).
              {'\n\n'}
              Los datos se procesan y guardan <Text style={styles.bold}>sólo en tu dispositivo</Text>: no se comparten ni almacenan en servidores externos.
              {'\n\n'}
              El uso de la app es voluntario y queda bajo tu responsabilidad.
            </Text>
          </ScrollView>

          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setDontShowAgain}
              value={dontShowAgain}
            />
            <Text style={styles.switchLabel}>No volver a mostrar</Text>
          </View>

          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Acepto y Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '85%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  acceptButton: {
    backgroundColor: '#3983f1',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 2,
    width: '100%',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DisclaimerModal;