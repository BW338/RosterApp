import React, { useState, useEffect } from "react";
import { 
  View,
  Text,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import KeyboardSpacer from "react-native-keyboard-spacer";

// Si tienes ToolBar2 e Info2, mantenelos importados
// import ToolBar2 from '../components/toolbar-2';
// import Info2 from '../screens/

// import Info2 from '../screens/info2';


// Reemplazo de GlobalStyles
const localStyles = StyleSheet.create({
  fondoViaticos: { flex: 1, resizeMode: "cover", justifyContent: "flex-start", alignItems: "center", backgroundColor: "#f0f8ff" },
  tituloFlex: { fontSize: 28, fontWeight: "bold", color: "white", textAlign: "center", marginVertical: 12, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  ModalStyle: { backgroundColor: "white", marginHorizontal: 20, padding: 20, borderRadius: 16, borderWidth: 2, borderColor: "#85C1E9" },
  TitleFlex: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 12, color: "#333" },
  valor$: { fontSize: 20, fontWeight: "bold", marginRight: 5 },
  valorHr: { flex: 1, borderWidth: 1, borderRadius: 6, paddingHorizontal: 5 },
  CerrarModal: { marginTop: 12 },
  sumaFlex: { fontSize: 20, fontWeight: "bold", color: "black", marginTop: 12 },
  textMonth: { fontWeight: "bold", fontStyle: "italic", textTransform: "uppercase" },
  totalHr: { color: "black", backgroundColor: "lightgrey", fontWeight: "bold", fontSize: 24 },
});

const styles = StyleSheet.create({
  calendarStyle: { borderWidth: 2, borderColor: "white", borderRadius: 20, padding: 5, marginHorizontal: 7 },
  calendarTheme: {
    monthTextColor: "#008b8b",
    textMonthFontSize: 24,
    textMonthFontWeight: "bold",
    arrowColor: "pink",
    arrowHeight: 60,
    arrowWidth: 60,
    calendarBackground: "black",
    dayTextColor: "white",
    textInactiveColor: "red",
    textSectionTitleColor: "#008b8b",
    textDayFontSize: 20,
    textDisabledColor: "grey",
  },
  text: { color: "white", borderWidth: 3, borderColor: "white", textAlign: "center", fontWeight: "bold", borderRadius: 10, padding: 9, marginHorizontal: 5, backgroundColor: "black", marginTop: 16, fontSize: 18 },
  almanaque: { alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#000" },
  dayText: { fontSize: 16 },
  registoRav: { flex: 1, justifyContent: "flex-start", opacity: 1, marginTop: 100, backgroundColor: "#add8e6", borderWidth: 3, padding: 3, margin: 10, borderRadius: 10 },
  ravTitulo: { fontSize: 28, padding: 1, fontWeight: "bold", textAlign: "center", backgroundColor: "white", borderWidth: 2, borderRadius: 16, textShadowColor: "#deb887", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 10 },
});


const ControlFlex = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [suma, setSuma] = useState({});
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleDateString("es", { month: "long" })
  );
  const [valorHr, setValorHr] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ravVisible, setRavVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [hideArrows, setHideArrows] = useState(false);
  const [sweep, setSweep] = useState(true);
  const navigation = useNavigation();
  const [Frav, setFRav] = useState({});

  useEffect(() => {
    loadPersistedData();

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString("es", { month: "long" });
    const currentDay = currentDate.toLocaleDateString("es", { day: "2-digit" });

    if (Platform.OS === "android") {
      ToastAndroid.show("Cargando datos...", ToastAndroid.SHORT);
    }

    if (currentDay === "01") {
      console.log("Cambio de mes deshabilitado");
      setHideArrows(true);
      setSweep(false);
    } else {
      setHideArrows(false);
      setSweep(true);
    }
  }, []);

  useEffect(() => {
    saveDataToStorage();
  }, [markedDates, suma, valorHr, Frav]);

  const handleChangeText = (newValor) => setValorHr(newValor);

  const loadPersistedData = async () => {
    try {
      const storedDataFlex = await AsyncStorage.getItem("calendarDataFlex");
      if (storedDataFlex) {
        const { markedDates: storedMarkedDates, suma: storedSuma, Frav: storedFRav, valorHr: storedvalorHr } = JSON.parse(storedDataFlex);
        setFRav(storedFRav);
        setMarkedDates(storedMarkedDates);
        setValorHr(storedvalorHr);
        setSuma(storedSuma);
      }
    } catch (error) {
      console.log("Error al cargar los datos:", error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      const dataToStore = JSON.stringify({ markedDates, suma, valorHr, Frav });
      await AsyncStorage.setItem("calendarDataFlex", dataToStore);
    } catch (error) {
      console.log("Error al guardar los datos:", error);
    }
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    const updatedMarkedDates = { ...markedDates };
    const updatedSuma = { ...suma };

    const localDate = new Date(selectedDate);
    localDate.setDate(localDate.getDate() + 1);
    const adjustedDate = localDate.toISOString().split("T")[0];

    setFRav((prevSelectedDates) => ({
      ...prevSelectedDates,
      [adjustedDate]: "",
    }));

    saveDataToStorage();

    if (updatedMarkedDates[selectedDate]) {
      const isBlue = updatedMarkedDates[selectedDate].customStyles.container.backgroundColor === "blue";
      if (isBlue) {
        updatedSuma[currentMonth] = (updatedSuma[currentMonth] || 0) + 2;
        updatedMarkedDates[selectedDate].customStyles.container.backgroundColor = "green";
        updatedMarkedDates[selectedDate].customStyles.text.color = "white";
      } else {
        delete updatedMarkedDates[selectedDate];
        updatedSuma[currentMonth] = (updatedSuma[currentMonth] || 0) - 4;
        const newFrav = { ...Frav };
        delete newFrav[adjustedDate];
        setFRav(newFrav);
      }
    } else {
      updatedSuma[currentMonth] = (updatedSuma[currentMonth] || 0) + 2;
      updatedMarkedDates[selectedDate] = {
        selected: true,
        customStyles: {
          container: { backgroundColor: "blue" },
          text: { color: "white", fontWeight: "bold" },
        },
      };
    }

    setMarkedDates({ ...updatedMarkedDates });
    setSuma(updatedSuma);
  };

  const handleMonthChange = (newMonth) => {
    const selectedDate = new Date(newMonth.timestamp);
    const monthName = selectedDate.toLocaleString("es", { month: "long" });
    setCurrentMonth(monthName);
  };

  const AbrirModal = () => setModalVisible(true);

  const abrirRav = () => {
    if (!ravVisible) {
      setRavVisible(true);
    } else {
      setRavVisible(false);
      saveDataToStorage();
    }
  };

  const Back = () => navigation.navigate("Home");
  const IrAViaticos = () => navigation.navigate("Viaticos");
  const infoOn2 = () => setInfoVisible(!infoVisible);

  return (
    <>
      <StatusBar backgroundColor="#85C1E9" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
       <View style={localStyles.fondoViaticos}>

          <Text style={localStyles.tituloFlex}>Control Hr Flex</Text>

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
      customStyle = {
        backgroundColor:
          markedDates[day.dateString].customStyles?.container?.backgroundColor || "blue",
      };
    }
    return (
      <View style={[styles.almanaque, customStyle]}>
        <Text style={styles.dayText}>{day.day}</Text>
      </View>
    );
  }}
/>


  
     <View style={{ flexDirection: "row", alignItems: "center" }}>
  <Text style={styles.text}>Total de Horas Flex</Text>
  <Text style={styles.textMonth}> {currentMonth} </Text>
  <Text style={styles.totalHr}> {suma[currentMonth] || 0} </Text>
</View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
              <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: "flex-end", opacity: 0.94 }}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
              >
                <View style={{ flex: 1, justifyContent: "flex-end", opacity: 0.94 }}>
                  <View style={localStyles.ModalStyle}>
                    <Text style={localStyles.TitleFlex}>INGRESA EL VALOR DE TU HORA FLEX</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={localStyles.valor$}>$ </Text>
                      <TextInput
                        style={localStyles.valorHr}
                        value={valorHr.toString()}
                        keyboardType="number-pad"
                        onChangeText={handleChangeText}
                        placeholder="$$$$$"
                        clearTextOnFocus={true}
                      />
                    </View>
                    <TouchableOpacity style={localStyles.CerrarModal}>
                      <Button title="Aceptar" onPress={() => setModalVisible(false)} />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>

            <KeyboardSpacer />

            {/* Info2 y ToolBar2 se mantienen si los tienes */}
            {/* <Info2 infoVisible={infoVisible} setInfoVisible={setInfoVisible} infoOn2={infoOn2} AbrirModal={AbrirModal} abrirRav={abrirRav} /> */}

            <View style={{ marginBottom: 60 }}>
              <Text style={localStyles.sumaFlex}>Suma $ {valorHr * (suma[currentMonth] || 0)}</Text>
            </View>
          </View>

          {/* Modal RAV */}
          <Modal visible={ravVisible} animationType="slide" transparent={true}>
            <KeyboardAvoidingView
              style={{ flex: 1, justifyContent: "flex-start", marginBottom: 0 }}
              behavior={Platform.OS === "ios" ? "padding" : null}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
            >
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.registoRav}>
                  <Text style={styles.ravTitulo}>REGISTRO FLEX - RAV</Text>
                  {/* Aquí iría todo el contenido de columnas izquierda/derecha del RAV, igual que antes */}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>

          {/* ToolBar2 */}
          {/* <View style={{ width: "100%", position: "absolute", bottom: 0 }}>
            <ToolBar2 Back={Back} AbrirModal={AbrirModal} infoOn2={infoOn2} abrirRav={abrirRav} viaticos={IrAViaticos} />
          </View> */}
</View>      </TouchableWithoutFeedback>
    </>
  );
};

export default ControlFlex;
