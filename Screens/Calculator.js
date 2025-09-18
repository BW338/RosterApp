// screens/ScreenA.js
import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
  Modal,
  ToastAndroid,
  Platform,
  Vibration,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {
  Foundation,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Styles from "../Styles/CalculatorStyles";

export default function CalculatorScreen() {
  // --- Estados ---
  const [esreloj1visible, setreloj1visible] = useState(false);
  const [esreloj2visible, setreloj2visible] = useState(false);
  const [esreloj3visible, setreloj3visible] = useState(false);

  const [modal, setmodal] = useState(false);

  const [checkin, setCheckin] = useState("Check-in");
  const [HrETD, setHrETD] = useState("E T D");
  const [HrETA, setHrETA] = useState("E T A");

  const [ETDprevisto, setETDprevisto] = useState("ETD previsto");
  const [Atareal, setATAreal] = useState("ATA Real");
  const [Dif, setDif] = useState("DIF");
  const [Total, setTotal] = useState("TOTAL");

  const [ulteta, setulteta] = useState("Ultimo Aterrizaje");
  const [TVS, setTSV] = useState("T S V");
  const [TTEE, setTTEE] = useState("TT EE");

  const [Flex, setFlex] = useState("HS FLEX");
  const [flexColor, setflexColor] = useState("transparent");

  const [vencColor, setvencColor] = useState("yellow");

  // --- Funciones ---
  const Reset = () => {
    setCheckin("Check-in");
    setHrETD("E T D");
    setHrETA("E T A");
    setulteta("Ultimo Aterrizaje");
    setTSV("T S V");
    setTTEE("TT EE");
    setFlex("HS FLEX");
    setvencColor("yellow");
    setflexColor("transparent");

    if (Platform.OS === "android") {
      ToastAndroid.show("Reset", ToastAndroid.SHORT);
    } else {
      Toast.show({ text1: "Reset" });
    }
  };

  const calcular = () => {
    if (checkin === "Check-in") {
      Alert.alert("ATENCIÓN!", "Debes ingresar al menos horario de presentacion");
      setulteta("Ultimo Aterrizaje");
      setTSV("T S V");
      setTTEE("TT EE");
      setFlex("HS FLEX");
      setvencColor("yellow");
      return;
    }

    const CK_moment = moment(checkin, "HH:mm");
    let ETA_moment = moment(HrETA, "HH:mm");

    // Si la hora de llegada es anterior a la de check-in, asumimos que es del día siguiente.
    if (HrETA !== "E T A" && ETA_moment.isBefore(CK_moment)) {
      ETA_moment.add(1, 'day');
    }

    const CK = CK_moment.toDate(); // Se mantiene para CKh y CKm
    const CKms = CK.getTime();
    const ETAms = ETA_moment.valueOf();

    // --- Cálculos de TSV y TTEE (solo si hay ETA) ---
    if (HrETA !== "E T A") {
      const differenceMS = ETAms - CKms + 1800000; // +30 min
      const TTEEms = ETAms - CKms;

      const difference = new Date(differenceMS);
      const TTEEs = new Date(TTEEms);

      const hoursTSV = difference.getUTCHours();
      const minutesTSV = difference.getUTCMinutes();
      setTSV(`${hoursTSV}:${minutesTSV.toString().padStart(2, "0")}`);

      const hoursTTEE = TTEEs.getUTCHours();
      const minutesTTEE = TTEEs.getUTCMinutes();
      setTTEE(`${hoursTTEE}:${minutesTTEE.toString().padStart(2, "0")}`);

      // --- Cálculo de Horas Flex ---
      if ( (hoursTTEE === 8 && minutesTTEE > 0) || (hoursTTEE > 8 && hoursTTEE < 10) || (hoursTTEE === 10 && minutesTTEE === 0) ) {
        setFlex("2 HS FLEX");
        setflexColor("#7cfc00");
      } else if ((hoursTTEE === 10 && minutesTTEE > 0) || hoursTTEE > 10) {
        setFlex("4 HS FLEX");
        setflexColor("#7cfc00");
      } else {
        setFlex("HS FLEX");
        setflexColor("transparent");
      }
    } else {
      setTSV("T S V");
      setTTEE("TT EE");
      setFlex("HS FLEX");
      setflexColor("transparent");
    }

    // --- Cálculo de Último Aterrizaje ---
    const CKh = CK.getHours();
    const CKm = CK.getMinutes();
    let multiplo = 0;

    if (CKh >= 19 || CKh <= 5) {
      const reductionMap = { 19: 3, 20: 3, 21: 3, 22: 3, 23: 3, 0: 3, 1: 2.5, 2: 2, 3: 1.5, 4: 1, 5: 0.5 };
      multiplo = reductionMap[CKh] ?? 0;
    } else if (CKh >= 11 && CKh <= 18) {
      if (CKh === 11 && CKm >= 15) multiplo = 0.25;
      else if ((CKh === 11 && CKm >= 30) || (CKh === 12 && CKm < 45)) multiplo = 0.5;
      else if (CKh === 12 && CKm >= 45) multiplo = 0.75;
      else if (CKh === 13 || (CKh === 14 && CKm < 15)) multiplo = 1;
      else if (CKh === 14 && CKm >= 15) multiplo = 1.25;
      else if ((CKh === 14 && CKm >= 30) || (CKh === 15 && CKm <= 45)) multiplo = 1.5;
      else if (CKh === 15 && CKm >= 45) multiplo = 1.75;
      else if (CKh === 16 || (CKh === 17 && CKm < 15)) multiplo = 2;
      else if (CKh === 17 && CKm >= 15) multiplo = 2.25;
      else if ((CKh === 17 && CKm > 15) || (CKh === 18 && CKm < 45)) multiplo = 2.5;
      else if (CKh === 18 && CKm >= 45) multiplo = 2.75;
    }

    let ultetaMS = CKms + 3600000 * 13 - 3600000 * multiplo;
    ultetaMS -= 1800000; // Restar 30 min del fin de servicio
    const ultetaDate = new Date(ultetaMS);
    setulteta( `${ultetaDate.getHours()}:${ultetaDate.getMinutes().toString().padStart(2, "0")}` );

    // --- Cálculos para el Modal Flex ---
    const ETDprevistoms = CKms + 14400000;
    const ETDprevistoDate = new Date(ETDprevistoms);
    setETDprevisto( `${ETDprevistoDate.getHours()}:${ETDprevistoDate.getMinutes().toString().padStart(2, "0")}` );

    const ATArealms = ETAms + 10800000;
    const ATArealToDate = new Date(ATArealms);
    setATAreal( `${ATArealToDate.getHours()}:${ATArealToDate.getMinutes().toString().padStart(2, "0")}` );

    const Difms = ATArealms - ETDprevistoms;
    const DifToDate = new Date(Difms);
    setDif( `${DifToDate.getUTCHours()}:${DifToDate.getMinutes().toString().padStart(2, "0")}` );

    const Totalms = Difms + 3600000;
    const TotalToDate = new Date(Totalms);
    setTotal( `${TotalToDate.getUTCHours()}:${TotalToDate.getMinutes().toString().padStart(2, "0")}` );

    // --- Validación de aterrizaje ---
    if (HrETA !== "E T A" && ETAms > ultetaMS) {
      Vibration.vibrate(100);
      Toast.show({ type: "error", text1: "ATENCION!", text2: "Horario de aterrizaje excedido." });
      setvencColor("red");
    } else {
      setvencColor("yellow");
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#2E86C1" barStyle="light-content" />
      <ImageBackground source={require("../assets/bg1.png")} style={Styles.backgroundImage} resizeMode="cover" >
        <View style={Styles.container}>
          {/* Modal FLEX */}
          <Modal visible={modal} animationType="slide" transparent>
            <View style={Styles.modalContainer}>
              <View style={Styles.modalBox}>
                <Text style={Styles.modalTitle}>Planilla Hs FLEX</Text>
                <Text style={Styles.modalText}>{"ETD PREVISTO: " + ETDprevisto}</Text>
                <Text style={Styles.modalText}>{"ATA REAL: " + Atareal}</Text>
                <Text style={Styles.modalText}>{"DIFERENCIA: " + Dif}</Text>
                <Text style={Styles.modalText}>{"PRE-POST VUELO: 1:00"}</Text>
                <Text style={Styles.modalText}>{"TOTAL: " + Total}</Text>
                <Text style={{ textAlign: "center", marginTop: 10, color: "#555" }}> Todo en hora Z (G.M.T) </Text>
                <View style={{ marginTop: 20, width: '50%' }}>
                  <Button title="Cerrar" onPress={() => setmodal(false)} />
                </View>
              </View>
            </View>
          </Modal>

          {/* Inputs */}
          <View style={Styles.inputSection}>
            {/* Fila Check-in */}
            <View style={Styles.row}>
              <MaterialCommunityIcons name="car-clock" size={40} color="black" onPress={() => setreloj1visible(true)} />
              <TouchableOpacity onPress={() => setreloj1visible(true)}>
                <Text style={Styles.timeText}>{checkin}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={esreloj1visible}
                mode="time"
                is24Hour
                onConfirm={(time) => { setCheckin(moment(time).format("HH:mm")); setreloj1visible(false); }}
                onCancel={() => setreloj1visible(false)}
                themeVariant="light" // 💡 Forzar tema claro para visibilidad en iOS
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 💡 Mejor UI en iOS
              />
            </View>

            {/* Fila Despegue y Aterrizaje */}
            <View style={Styles.rowCombined}>
              {/* Despegue */}
              <View style={Styles.timeInputContainer}>
                <MaterialIcons name="flight-takeoff" size={40} color="black" onPress={() => setreloj2visible(true)} />
                <TouchableOpacity onPress={() => setreloj2visible(true)}>
                  <Text style={Styles.timeTextSmall}>{HrETD}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={esreloj2visible}
                  mode="time"
                  is24Hour
                  onConfirm={(time) => { setHrETD(moment(time).format("HH:mm")); setreloj2visible(false); }}
                  onCancel={() => setreloj2visible(false)}
                  themeVariant="light" // 💡 Forzar tema claro
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 💡 Mejor UI en iOS
                />
              </View>
              {/* Aterrizaje */}
              <View style={Styles.timeInputContainer}>
                <MaterialCommunityIcons name="airplane-landing" size={40} color="black" onPress={() => setreloj3visible(true)} />
                <TouchableOpacity onPress={() => setreloj3visible(true)}>
                  <Text style={Styles.timeTextSmall}>{HrETA}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={esreloj3visible}
                  mode="time"
                  is24Hour
                  onConfirm={(time) => { setHrETA(moment(time).format("HH:mm")); setreloj3visible(false); }}
                  onCancel={() => setreloj3visible(false)}
                  themeVariant="light" // 💡 Forzar tema claro
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 💡 Mejor UI en iOS
                />
              </View>
            </View>
          </View>

          {/* Resultados */}
          <View style={Styles.results}>
            <View style={Styles.resultBox}>
              <AntDesign name="warning" size={40} color={vencColor} />
              <Text style={Styles.resultLabel}>ULT-ETA</Text>
              <Text style={[Styles.resultText, vencColor === 'red' && { color: 'red' }]}>{ulteta}</Text>
            </View>
            <View style={Styles.resultBox}>
              <MaterialCommunityIcons name="timetable" size={40} color="black" />
              <Text style={Styles.resultLabel}>TSV</Text>
              <Text style={Styles.resultText}>{TVS}</Text>
            </View>
            <View style={Styles.resultBox}>
              <Ionicons name="timer" size={40} color="black" />
              <Text style={Styles.resultLabel}>TT EE</Text>
              <Text style={Styles.resultText}>{TTEE}</Text>
            </View>
            <View style={Styles.resultBox}>
              <Foundation name="clipboard-notes" size={40} color={flexColor} onPress={() => (flexColor !== "transparent" ? setmodal(true) : null)} />
              <Text style={Styles.resultLabel}>FLEX</Text>
              <Text style={Styles.resultText}>{Flex}</Text>
            </View>
          </View>

          {/* Botones */}
          <View style={Styles.footer}>
             <TouchableOpacity style={Styles.footerButton} onPress={calcular}>
              <Ionicons name="calculator" size={28} color="#007AFF" />
              <Text style={Styles.footerText}>Calcular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.footerButton} onPress={Reset}>
               <Ionicons name="refresh" size={28} color="#FF3B30" />
              <Text style={Styles.footerText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <Toast />
    </>
  );
}
