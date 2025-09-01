import React, { useEffect, useState } from "react";
import { View, Text, SectionList, SafeAreaView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlightCard from "../Components/FlightCard/FlightCard";
import styles from "../Styles/RosterScreenStyles"; // <- estilos separados

export default function RosterScreen({ route, navigation }) {
  const [roster, setRoster] = useState([]);

  // ⬆️ Configurar encabezado con botón
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Actualizar roster"
          onPress={() => navigation.navigate("RosterPannel")}
        />
      ),
    });
  }, [navigation]);

  // Helper para calcular TE = TSV - 30 min
  const subtractMinutes = (timeStr, minutesToSubtract) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() - minutesToSubtract);
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const dayMap = {
  MON: "Lunes",
  TUE: "Martes",
  WED: "Miércoles",
  THU: "Jueves",
  FRI: "Viernes",
  SAT: "Sábado",
  SUN: "Domingo",
};

// 🔹 Función que convierte "01MON" → "01 Lun"
const formatDateShort = (title) => {
  if (!title || title.length < 5) return title;

  const day = title.slice(0, 2);      // "01"
  const dayEng = title.slice(2, 5);   // "MON"
  const dayEsp = dayMap[dayEng] || dayEng;

  return `${day} ${dayEsp}`; // 👉 "01 Lun"
};

  // Cargar roster
  useEffect(() => {
    const loadRoster = async () => {
      try {
        if (route.params?.roster && route.params.roster.length > 0) {
          setRoster(route.params.roster);
          return;
        }

        const saved = await AsyncStorage.getItem("roster");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            setRoster(parsed);
            return;
          }
        }
      } catch (err) {
        console.error("❌ Error en loadRoster:", err);
      }
    };

    loadRoster();
  }, [route.params]);

  if (!roster || roster.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text>No hay roster cargado</Text>
        <Text>Usá el botón "Actualizar roster" arriba para cargarlo</Text>
      </SafeAreaView>
    );
  }

  const getDynamicStyle = (timeString) => {
  // Si viene en formato "HH:MM"
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + (minutes || 0);

  return {
    color: totalMinutes >= 480 ? "#6959C2" : "#333", // verde si >= 8h
  };
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <SectionList
          sections={roster.map((d) => ({
            title: d.date,
            tv: d.tv,
            tsv: d.tsv,
            data: d.flights.length > 0 ? d.flights : [{ note: d.note }],
          }))}
          keyExtractor={(item, index) => index.toString()}
renderItem={({ item, index, section }) => (
  <FlightCard
    flight={item}
    isLastOfDay={index === section.data.length - 1} // 👉 último tramo del día
    tv={section.tv}
    tsv={section.tsv}
    te={section.te}
  />
)}
          renderSectionHeader={({ section: { title, tv, tsv }, index }) => {
            const te = subtractMinutes(tsv, 30);

            return (
              <View
                style={[
                  styles.sectionHeader,
                  index % 2 === 0
                    ? styles.sectionHeaderEven
                    : styles.sectionHeaderOdd,
                ]}
              >
                {/* Fecha a la izquierda */}
<Text style={styles.sectionHeaderText}>{formatDateShort(title)}</Text>

                {/* TE | TSV | TV a la derecha */}
             <View style={styles.totalsContainer}>
  {te && (
    <Text
      style={[
        styles.sectionHeaderTotals,
        getDynamicStyle(te) // 🔹 aplicamos el color dinámico
      ]}
    >
      TTEE: {te}
    </Text>
  )}
  {/* {tsv && (
    <Text
      style={[
        styles.sectionHeaderTotals,
        getDynamicStyle(tsv)
      ]}
    >
      TSV: {tsv}
    </Text>
  )}
  {tv && (
    <Text
      style={[
        styles.sectionHeaderTotals,
        getDynamicStyle(tv)
      ]}
    >
      TV: {tv}
    </Text>
  )} */}
</View>

              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
