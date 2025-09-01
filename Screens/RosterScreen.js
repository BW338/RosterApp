import React, { useEffect, useState, useRef } from "react";
import { View, Text, SectionList, SafeAreaView, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlightCard from "../Components/FlightCard/FlightCard";
import { formatDateShort } from "../Helpers/date";
import { scrollToToday } from "../Helpers/scrollHelpers";
import TodayButton from "../Components/Buttons/TodayButton";
import styles from "../Styles/RosterScreenStyles"; 

export default function RosterScreen({ route, navigation }) {
  const [roster, setRoster] = useState([]);


  const sectionListRef = useRef(null);
  // ⬆️ Configurar encabezado con botón

    useEffect(() => {
    if (roster.length > 0) {
      setTimeout(() => {
        scrollToToday(roster, sectionListRef);
      }, 300); // pequeño delay para que el SectionList monte
    }
  }, [roster]);
  
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

  const isToday = (title) => {
  if (!title || title.length < 5) return false;

  // 🔹 title viene así: "01MON"
  const day = parseInt(title.slice(0, 2), 10);
  const month = new Date().getMonth(); // 0-based
  const today = new Date().getDate();

  return day === today; // 🚀 match por día
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
  ref={sectionListRef}
  sections={roster.map(d => ({
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
  const today = isToday(title);

  return (
    <View
      style={[
        styles.sectionHeader,
        index % 2 === 0 ? styles.sectionHeaderEven : styles.sectionHeaderOdd,
        today && styles.todaySection // 🔹 estilo para hoy
      ]}
    >
      <Text style={styles.sectionHeaderText}>
        {formatDateShort(title)}
      </Text>

     <View style={styles.totalsContainer}>
  {te && (
    <Text style={[styles.sectionHeaderTotals, getDynamicStyle(te)]}>
      TE: {te}
    </Text>
  )}
</View>

    </View>

            );
          }}
        />
<TodayButton onPress={() => scrollToToday(roster, sectionListRef)} />


      </View>
    </SafeAreaView>
  );
}
