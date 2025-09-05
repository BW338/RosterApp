import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../Styles/CalendarScreenStyles";

// 🎨 Colores pastel + bordes
const COLORS = {
  libre: { bg: "rgba(0, 255, 0, 0.15)", border: "#3cff00ff" },
  trabajo: { bg: "rgba(204, 194, 57, 0.15)", border: "#c7b834ff" },
  gua: { bg: "rgba(255,59,48,0.15)", border: "#FF3B30" },
  esm: { bg: "rgba(255,149,0,0.15)", border: "#FF9500" },
};

export default function CalendarScreen() {
  const [roster, setRoster] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const loadRoster = async () => {
    try {
      const saved = await AsyncStorage.getItem("roster");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRoster(parsed);
        generateMarks(parsed);
      } else {
        setRoster([]);
        setMarkedDates({});
        setSelectedDay(null);
      }
    } catch (err) {
      console.log("❌ Error cargando roster:", err);
    }
  };

  useEffect(() => { loadRoster(); }, []);
  useFocusEffect(useCallback(() => { loadRoster(); }, []));

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const found = roster.find((d) => d.fullDate.startsWith(today));
    setSelectedDay(found || null);
  }, [roster]);

  const getDayType = (day) => {
    if (!day) return "libre";
    if (day.flights && day.flights.some(f => f.type === "OP" || /^AR\d+/.test(f.flightNumber))) return "vuelo";
    if (day.note === "GUA") return "guardia";
    if (day.note === "ESM") return "esm";
    return "libre";
  };

  const generateMarks = (data) => {
    const marks = {};
    data.forEach((day) => {
      const date = day.fullDate.split("T")[0];
      let estado = "libre";
      if (day.flights.some((f) => f.type === "GUA")) estado = "gua";
      else if (day.flights.some((f) => f.type === "ESM")) estado = "esm";
      else if (day.flights.some((f) => f.type === "OP" || f.type.startsWith("AR"))) estado = "trabajo";

      marks[date] = {
        customStyles: {
          container: {
            backgroundColor: COLORS[estado].bg,
            borderColor: COLORS[estado].border,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          text: { color: "#222", fontWeight: "600" },
        },
      };
    });
    setMarkedDates(marks);
  };

  const handleDayPress = (day) => {
    const found = roster.find((d) => d.fullDate.startsWith(day.dateString));
    setSelectedDay(found || null);
  };

const renderTimeline = (dayData) => {
  if (!dayData) return null;

  const type = getDayType(dayData);
  let depFirst, end;

  if (type === "vuelo") {
    depFirst = dayData.checkin || dayData.flights[0].depTime;
    const lastFlight = dayData.flights[dayData.flights.length - 1];
    end = lastFlight.checkout || lastFlight.arrTime;
  } else if (type === "guardia" || type === "esm") {
    depFirst = "00:00";
    end = "23:59";
  } else {
    return null;
  }

  const [startH, startM] = depFirst.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startHour = startH + startM / 60;
  const endHour = endH + endM / 60;

  const blocks = Array.from({ length: 24 }, (_, h) => {
    const active = h >= Math.floor(startHour) && h < Math.ceil(endHour);
    return (
      <View key={h} style={[styles.hourBlock, active ? styles.activeBlock : styles.inactiveBlock]}>
        <Text style={styles.hourLabel}>{h}:00</Text>
      </View>
    );
  });

  return (
    <View style={styles.timelineContainer}>
      {/* Timeline visual solamente, sin encabezado */}
      <View style={styles.timeline}>{blocks}</View>
    </View>
  );
};


  return (
    <View style={styles.container}>
      <Calendar
        initialDate={new Date().toISOString().split("T")[0]}
        markedDates={{
          ...markedDates,
          [selectedDay?.fullDate?.split("T")[0]]: {
            customStyles: {
              container: {
                backgroundColor: markedDates[selectedDay?.fullDate?.split("T")[0]]?.customStyles?.container?.backgroundColor || "transparent",
                borderWidth: 2,
                borderColor: "rgba(128, 0, 128, 0.8)",
                borderRadius: 6,
              },
              text: { color: "#333", fontWeight: "bold" },
            },
          },
        }}
        markingType={"custom"}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: "#673ab7",
          "stylesheet.day.basic": { todayText: { color: "#673ab7", fontWeight: "bold" } },
          arrowColor: "#673ab7",
          monthTextColor: "#333",
          textDayFontWeight: "500",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 14,
          textDayHeaderFontSize: 18,
          textMonthFontSize: 18,
          textSectionTitleColor: "#333",
        }}
      />

      <ScrollView style={styles.infoBox}>
        {selectedDay ? (
          <>
            {/* Encabezado con Checkin */}
            <Text style={styles.title}>
              {`${new Date(selectedDay.fullDate).toLocaleDateString("es-ES", { day: "2-digit" })} ${new Date(selectedDay.fullDate)
                .toLocaleDateString("es-ES", { weekday: "long" })
                .charAt(0)
                .toUpperCase()}${new Date(selectedDay.fullDate)
                .toLocaleDateString("es-ES", { weekday: "long" })
                .slice(1)} | Checkin: ${selectedDay.checkin || selectedDay.flights[0]?.depTime || "--:--"}`}
            </Text>

            {/* Vuelos en renglones */}
            {selectedDay.flights.map((f, i) => (
              <Text key={i} style={{ marginVertical: 0 }}>
                {f.flightNumber} {f.origin} {f.depTime} - {f.arrTime} {f.destination}
                {i === selectedDay.flights.length - 1 && (f.checkout || f.arrTime) ? ` | Fin: ${f.checkout || f.arrTime}` : ""}
              </Text>
            ))}

            {/* Timeline visual */}
            {renderTimeline(selectedDay)}
          </>
        ) : (
          <Text style={styles.empty}>Seleccioná un día</Text>
        )}
      </ScrollView>
    </View>
  );
}
