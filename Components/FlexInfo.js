import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FlexInfo = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#ccc" />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Guía de Horas Flex</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Configurar Valor por Hora</Text>
              <Text style={styles.sectionText}>
                - Tocá donde dice <Text style={styles.bold}>"Valor Hora"</Text> en la parte inferior de la pantalla.
                {'\n'}- Ingresá el monto que corresponde a tu hora flex. Este valor se guardará en tu dispositivo.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Registrar Horas en el Calendario</Text>
              <Text style={styles.sectionText}>
                - Tocá un día en el calendario para registrar horas.
                {'\n'}- <Text style={styles.bold}>1er Toque:</Text> El día se pinta de <Text style={styles.bold}>azul</Text> y suma <Text style={styles.bold}>2 horas</Text>.
                {'\n'}- <Text style={styles.bold}>2do Toque:</Text> El día se pinta de <Text style={styles.bold}>verde</Text> y suma 2 horas más (total de <Text style={styles.bold}>4 horas</Text>).
                {'\n'}- <Text style={styles.bold}>3er Toque:</Text> El día se desmarca y se restan las 4 horas.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Consultar el Total</Text>
              <Text style={styles.sectionText}>
                - Debajo del calendario, verás el total de <Text style={styles.bold}>"Horas Flex"</Text> para el mes seleccionado.
                {'\n'}- La <Text style={styles.bold}>"Suma Total"</Text> en pesos se actualiza automáticamente al multiplicar las horas por el valor que configuraste.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Navegar entre Meses</Text>
              <Text style={styles.sectionText}>
                - Usá las flechas del calendario para moverte a otros meses.
                {'\n'}- Podés consultar o registrar horas en meses pasados o futuros. Los datos de cada mes se guardan por separado.
              </Text>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#007AFF',
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default FlexInfo;