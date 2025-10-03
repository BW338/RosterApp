import React, { useState, useEffect } from "react";
import { 
  View,
  Alert,
  Text,
  ToastAndroid,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform, 
  ImageBackground
} from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import styles from "../Styles/FlexStyles";
import { getToday } from "../Helpers/dateManager";
import FlexInfo from "../Components/FlexInfo";

// Nueva función para obtener una clave única de mes y año
const getMonthYearKey = (date) => {
  const monthName = date.toLocaleString("es", { month: "long" });
  const year = date.getFullYear();
  // Capitalizamos el mes para un formato consistente: "Septiembre-2024"
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}-${year}`;
};

const FlexScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [suma, setSuma] = useState({});
  // Usamos una clave que combina mes y año para el estado
  const [currentMonthKey, setCurrentMonthKey] = useState(getMonthYearKey(getToday()));
  const [valorHr, setValorHr] = useState(0);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hideArrows, setHideArrows] = useState(false);
  const [sweep, setSweep] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        height: 90, // Ajustamos la altura del header
        elevation: 3,
      },
      headerTitle: () => (
        <Text
          style={{ color: '#111827', fontSize: 20, fontWeight: '700' }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >Tus Horas Flex</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginRight: 15 }}>
          {/* Botón para borrar datos de Flex (desarrollo) */}
          <TouchableOpacity onPress={handleClearFlexData}>
            <Ionicons name="trash-outline" size={24} color={'#FF3B30'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]); // No es necesario añadir handleClearFlexData a las dependencias si se usa useCallback

  useEffect(() => {
    loadPersistedData();

    if (Platform.OS === "android") {
      ToastAndroid.show("Cargando datos...", ToastAndroid.SHORT);
    }

    // --- PARCHE DESACTIVADO ---
    // Se desactiva la lógica que bloqueaba el cambio de mes el día 1.
    setHideArrows(false);
    setSweep(true);

  }, []);

  useEffect(() => {
    saveDataToStorage();
  }, [markedDates, suma, valorHr]);

  const handleChangeText = (newValor) => setValorHr(newValor);

  const loadPersistedData = async () => {
    try {
      const storedDataFlex = await AsyncStorage.getItem("calendarDataFlex");
      if (storedDataFlex) {
        const { markedDates: storedMarkedDates, suma: storedSuma, valorHr: storedValorHr } = JSON.parse(storedDataFlex);
        setMarkedDates(storedMarkedDates || {});
        setSuma(storedSuma || {});
        setValorHr(storedValorHr || 0);
      }
    } catch (error) {
      console.log("Error al cargar los datos:", error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      const dataToStore = JSON.stringify({ markedDates, suma, valorHr });
      await AsyncStorage.setItem("calendarDataFlex", dataToStore);
    } catch (error) {
      console.log("Error al guardar los datos:", error);
    }
  };

  // Función para borrar los datos de Flex
  const handleClearFlexData = async () => {
    Alert.alert(
      "Borrar Datos de Flex",
      "¿Estás seguro de que quieres borrar todos los datos de Horas Flex? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("calendarDataFlex");
              // Reseteamos el estado local para reflejar el cambio en la UI
              setMarkedDates({});
              setSuma({});
              setValorHr(0);
              if (Platform.OS === 'android') ToastAndroid.show("Datos de Flex borrados", ToastAndroid.SHORT);
            } catch (e) {
              console.error("Error borrando datos de Flex:", e);
            }
          },
        },
      ]
    );
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    const updatedMarkedDates = { ...markedDates };
    const updatedSuma = { ...suma };

    if (updatedMarkedDates[selectedDate]) {
      const isBlue = updatedMarkedDates[selectedDate].customStyles.container.backgroundColor === "blue";
      if (isBlue) {
        // De azul a verde (2hs -> 4hs)
        updatedSuma[currentMonthKey] = (updatedSuma[currentMonthKey] || 0) + 2;
        updatedMarkedDates[selectedDate].customStyles.container.backgroundColor = "green";
      } else {
        // De verde a desmarcado
        delete updatedMarkedDates[selectedDate];
        updatedSuma[currentMonthKey] = (updatedSuma[currentMonthKey] || 0) - 4;
      }
    } else {
      // De desmarcado a azul (0hs -> 2hs)
      updatedSuma[currentMonthKey] = (updatedSuma[currentMonthKey] || 0) + 2;
      updatedMarkedDates[selectedDate] = {
        selected: true,
        customStyles: {
          container: { backgroundColor: "blue" },
          text: { color: "white", fontWeight: "bold" },
        },
      };
    }

    setMarkedDates(updatedMarkedDates);
    setSuma(updatedSuma);
  };

  const handleMonthChange = (newMonth) => {
    // Usamos el mes y año que provee el calendario para evitar desfases por zona horaria.
    // El mes en JS es 0-indexado (0=Enero), por eso restamos 1.
    const date = new Date(newMonth.year, newMonth.month - 1, 1);
    // Actualizamos la clave del mes/año actual para que coincida con el calendario.
    setCurrentMonthKey(getMonthYearKey(date));
  };

  const AbrirModal = () => setModalVisible(true);

  // Separamos mes y año de la clave para mostrarlos en la UI
  const [displayMonth, displayYear] = currentMonthKey.split('-');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={require("../assets/bgFlex.jpg")} style={styles.container}>
          <View style={styles.contentWrapper}>
            <View style={styles.calendarWrapper}>
              <Calendar
                hideExtraDays={true}
                enableSwipeMonths={sweep}
                hideArrows={hideArrows}
                style={styles.calendarStyle}
                theme={styles.calendarTheme}
                markedDates={markedDates}
                markingType={"custom"}
                onDayPress={handleDayPress}
                onMonthChange={handleMonthChange}
                renderDay={(day) => {
                  let customStyle = {};
                  if (markedDates[day.dateString]) {
                    const dayStyles = markedDates[day.dateString].customStyles;
                    customStyle = dayStyles?.container || {};
                  }
                  return (
                    <View style={[styles.almanaque, customStyle]}>
                      <Text style={[styles.dayText, customStyle.backgroundColor && { color: 'white' }]}>{day.day}</Text>
                    </View>
                  );
                }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.text}>
                Horas Flex
                <Text style={styles.textMonth}> {displayMonth} </Text>
                <Text style={styles.totalHr}> {suma[currentMonthKey] || 0} </Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.sumacontainer}>
              <Text style={styles.sumatext}>Suma Total: $ {valorHr * (suma[currentMonthKey] || 0)}</Text>
            </View>
            <TouchableOpacity style={styles.valorcontainer} onPress={AbrirModal}>
              <Text style={styles.valortext}>Valor Hora: $ {valorHr || 0}</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === "ios" ? "padding" : "padding"}
            >
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>INGRESA EL VALOR DE TU HORA FLEX</Text>
                <View style={styles.modalInputRow}>
                  <Text style={styles.modalCurrency}>$ </Text>
                  <TextInput
                    style={styles.modalInput}
                    value={valorHr.toString()}
                    keyboardType="number-pad"
                    onChangeText={handleChangeText}
                    placeholder="0"
                    clearTextOnFocus={true}
                    autoFocus={true}
                  />
                </View>
                <View style={styles.modalButtonContainer}>
                  <Button title="Aceptar" onPress={() => setModalVisible(false)} />
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </ImageBackground>
      </TouchableWithoutFeedback>

      {/* Modal de Información */}
      <FlexInfo
        visible={isInfoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
    </>
  );
};

export default FlexScreen;
