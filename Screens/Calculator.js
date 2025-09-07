// screens/ScreenA.js
import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  ToastAndroid,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  Foundation,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Styles from "../Styles/CalculatorStyles";

export default function Calculator() {
  const [esreloj1visible, setreloj1visible] = useState(false);
  const [esreloj2visible, setreloj2visible] = useState(false);
  const [esreloj3visible, setreloj3visible] = useState(false);

  const [modal, setmodal] = useState(false);

  // ⏱️ Fechas reales
  const [ckDate, setCkDate] = useState(null);
  const [etdDate, setEtdDate] = useState(null);
  const [etaDate, setEtaDate] = useState(null);

  // ⏱️ Textos mostrados
  const [checkin, setCheckin] = useState("Check-in");
  const [HrETD, setHrETD] = useState("E T D");
  const [HrETA, setHrETA] = useState("E T A");

  const [ulteta, setulteta] = useState("Ultimo Aterrizaje");
  const [TVS, setTSV] = useState("T S V");
  const [TTEE, setTTEE] = useState("TT EE");

  const [Flex, setFlex] = useState("HS FLEX");
  const [flexColor, setflexColor] = useState("transparent");

  const [vencColor, setvencColor] = useState("yellow");

  const Reset = () => {
    setCkDate(null);
    setEtdDate(null);
    setEtaDate(null);

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
    if (!ckDate) {
      Alert.alert("Error", "Selecciona un Check-in");
      return;
    }

    const CKms = ckDate.getTime();
    const CKh = ckDate.getHours();
    const CKm = ckDate.getMinutes();

    // --- Multiplicadores según la hora de CK ---
    let multiplo = 1;
    if (CKh === 23 && CKm >= 0) multiplo = 3;
    if (CKh === 5 && CKm >= 0) multiplo = 0.5;
    if (CKh === 10 && CKm >= 0) multiplo = 0.5;
    if (CKh === 14 && CKm >= 0) multiplo = 0.5;

    // Ult-ETA = CK + (13h * multiplo)
    let UltETAMS = CKms + 13 * multiplo * 3600000;
    let UltETADate = new Date(UltETAMS);
    setulteta(
      `${UltETADate.getHours()}:${UltETADate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

    // --- TSV ---
    if (etaDate) {
      let ETAMS = etaDate.getTime();
      let TSVms = ETAMS - CKms + 0.5 * 3600000;
      let TSVDate = new Date(TSVms);
      setTSV(
        `${TSVDate.getUTCHours()}:${TSVDate.getUTCMinutes()
          .toString()
          .padStart(2, "0")}`
      );

      // --- TTEE ---
      let TTEEMS = ETAMS - CKms;
      let TTEEDate = new Date(TTEEMS);
      setTTEE(
        `${TTEEDate.getUTCHours()}:${TTEEDate.getUTCMinutes()
          .toString()
          .padStart(2, "0")}`
      );

      // --- Validación de aterrizaje ---
      if (ETAMS - CKms < 0 || ETAMS > UltETAMS) {
        setvencColor("red");
        Alert.alert("Atención", "Horario de aterrizaje inválido.");
      } else {
        setvencColor("black");
      }

      // --- FLEX ---
      let horasTTEE = TTEEDate.getUTCHours();
      if (horasTTEE >= 8 && horasTTEE < 10) {
        setFlex("2 HS FLEX");
        setflexColor("orange");
      } else if (horasTTEE >= 10) {
        setFlex("4 HS FLEX");
        setflexColor("green");
      } else {
        setFlex("HS FLEX");
        setflexColor("black");
      }
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#2E86C1" barStyle="light-content" />

      {/* Modal FLEX */}
      <Modal visible={modal} animationType="slide" transparent>
        <View style={Styles.modalContainer}>
          <View style={Styles.modalBox}>
            <Text style={Styles.modalTitle}>Planilla Hs FLEX</Text>
            <Button title="Cerrar" onPress={() => setmodal(false)} />
          </View>
        </View>
      </Modal>

      <View style={Styles.container}>
        {/* Reloj Check-in */}
        <View style={Styles.row}>
          <MaterialCommunityIcons
            name="car-clock"
            size={40}
            onPress={() => setreloj1visible(true)}
          />
          <TouchableOpacity onPress={() => setreloj1visible(true)}>
            <Text style={Styles.timeText}>{checkin}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={esreloj1visible}
            mode="time"
            is24Hour
            onConfirm={(time) => {
              setCkDate(time);
              setCheckin(
                `${time.getHours()}:${time
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              );
              setreloj1visible(false);
            }}
            onCancel={() => setreloj1visible(false)}
          />
        </View>

        {/* Reloj ETD */}
        <View style={Styles.row}>
          <MaterialIcons
            name="flight-takeoff"
            size={40}
            onPress={() => setreloj2visible(true)}
          />
          <TouchableOpacity onPress={() => setreloj2visible(true)}>
            <Text style={Styles.timeText}>{HrETD}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={esreloj2visible}
            mode="time"
            is24Hour
            onConfirm={(time) => {
              setEtdDate(time);
              setHrETD(
                `${time.getHours()}:${time
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              );
              setreloj2visible(false);
            }}
            onCancel={() => setreloj2visible(false)}
          />
        </View>

        {/* Reloj ETA */}
        <View style={Styles.row}>
          <MaterialCommunityIcons
            name="airplane-landing"
            size={40}
            onPress={() => setreloj3visible(true)}
          />
          <TouchableOpacity onPress={() => setreloj3visible(true)}>
            <Text style={Styles.timeText}>{HrETA}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={esreloj3visible}
            mode="time"
            is24Hour
            onConfirm={(time) => {
              setEtaDate(time);
              setHrETA(
                `${time.getHours()}:${time
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              );
              setreloj3visible(false);
            }}
            onCancel={() => setreloj3visible(false)}
          />
        </View>

        {/* Resultados */}
        <View style={Styles.results}>
          <AntDesign name="warning" size={40} color={vencColor} />
          <Text>{ulteta}</Text>

          <MaterialCommunityIcons name="timetable" size={40} />
          <Text>{TVS}</Text>

          <Ionicons name="timer" size={40} />
          <Text>{TTEE}</Text>

          <Foundation
            name="clipboard-notes"
            size={40}
            color={flexColor}
            onPress={() => (flexColor === "green" ? setmodal(true) : null)}
          />
          <Text>{Flex}</Text>
        </View>

        {/* Botones */}
        <View style={Styles.footer}>
          <Button title="Calcular" onPress={calcular} />
          <Button title="Reset" onPress={Reset} />
        </View>
      </View>

      <Toast />
    </>
  );
}
