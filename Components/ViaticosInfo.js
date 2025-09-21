import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ViaticosInfo = ({ visible, onClose }) => {
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
          
          <Text style={styles.modalTitle}>Guía de Viáticos</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Configurar Valores</Text>
              <Text style={styles.sectionText}>
                - Antes de empezar, tocá el botón <Text style={styles.bold}>"Valores"</Text> en la esquina superior derecha.
                {'\n'}- Ingresá el monto que corresponde a cada tipo de viático (AEP, ESM, COR, etc.). Estos valores se guardarán en tu dispositivo.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Registrar Bandejas AEP</Text>
              <Text style={styles.sectionText}>
                - Tocá un día en el calendario para marcar que tuviste una bandeja AEP.
                {'\n'}- El día se marcará y se sumará al contador de "Bandejas AEP".
                {'\n'}- Si te equivocaste, volvé a tocar el día para desmarcarlo.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Registrar Postas y ESM</Text>
              <Text style={styles.sectionText}>
                - Usá el menú desplegable <Text style={styles.bold}>"Postas y ESM"</Text>.
                {'\n'}- Seleccioná la posta que realizaste (ej: "COR x1", "ESM x2").
                {'\n'}- La app multiplicará el valor que configuraste por la cantidad seleccionada y lo agregará a la lista.
                {'\n'}- Podés eliminar una posta de la lista tocando el ícono de la papelera.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Ver el Total</Text>
              <Text style={styles.sectionText}>
                - A la izquierda, verás el desglose de tus viáticos para el mes seleccionado.
                {'\n'}- El <Text style={styles.bold}>"Total"</Text> se actualiza automáticamente.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Resetear el Mes</Text>
              <Text style={styles.sectionText}>
                - El botón <Text style={styles.bold}>"Reset"</Text> en la esquina superior derecha borrará <Text style={styles.bold}>TODOS</Text> los datos del mes que estás viendo actualmente (días marcados y postas). Úsalo con cuidado.
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

export default ViaticosInfo;