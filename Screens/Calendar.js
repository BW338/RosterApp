import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import styles from "../Styles/CalendarScreenStyles";

export default function CalendarScreen() {
  const [roster, setRoster] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

useFocusEffect(
  useCallback(() => {
    const loadRoster = async () => {
      try {
        const saved = await AsyncStorage.getItem("roster");
        if (saved) {
          const parsed = JSON.parse(saved);
          setRoster(parsed);
          generateMarks(parsed);
          console.log('***' + parsed)
        }
      } catch (err) {
        console.log("❌ Error cargando roster:", err);
      }
    };
    loadRoster();
  }, [])
);

const loadRoster = async () => {
  try {
    const saved = await AsyncStorage.getItem("roster");
    if (saved) {
      const parsed = JSON.parse(saved);
      setRoster(parsed);
      generateMarks(parsed);
      console.log("✅ Roster cargado:", parsed.length);
    } else {
      // 👉 Si no hay datos en AsyncStorage, limpiamos el estado
      setRoster([]);
      setMarkedDates({});
      setSelectedDay(null);
      console.log("📭 No hay roster guardado, limpiando calendario");
    }
  } catch (err) {
    console.log("❌ Error cargando roster:", err);
  }
};


useEffect(() => {
  loadRoster(); // cuando se monta
}, []);

useFocusEffect(
  useCallback(() => {
    loadRoster(); // cada vez que entra en foco
  }, [])
);


  // 👉 Determina el tipo de día
  const getDayType = (day) => {
    if (!day) return "libre";

    if (day.flights && day.flights.some(f => f.type === "OP" || /^AR\d+/.test(f.flightNumber))) {
      return "vuelo";
    }
    if (day.note === "GUA") return "guardia";
    if (day.note === "ESM") return "esm";

    return "libre";
  };

const generateMarks = (data) => {
  const marks = {};
  data.forEach((day) => {
    if (day.fullDate) {
      const dateKey = day.fullDate.split("T")[0];
      let color = "blue"; // por defecto libre
      let textColor = "white";

      if (day.flights && day.flights.length > 0) {
        const types = day.flights.map((f) => f.type);

        if (types.includes("GUA")) {
          color = "red"; // guardia
        } else if (types.includes("ESM")) {
          color = "orange"; // esm
        } else if (
          types.some(
            (t) => t.startsWith("OP") || t.startsWith("AR") || t.match(/^[A-Z]{2}\d+/)
          )
        ) {
          color = "green"; // vuelos normales
        }
      }

      marks[dateKey] = {
        customStyles: {
          container: {
            backgroundColor: color,
            borderRadius: 6,
          },
          text: {
            color: textColor,
            fontWeight: "bold",
          },
        },
      };
    }
  });
  setMarkedDates(marks);
};


  const handleDayPress = (day) => {
    const found = roster.find((d) => d.fullDate.startsWith(day.dateString));
    setSelectedDay(found || null);
    console.log("📅 Día seleccionado:", day.dateString);
    console.log("📋 Datos del roster en ese día:", found);
  };

  const renderTimeline = (dayData) => {
    if (!dayData) return null;

    let depFirst, end, label;

    const type = getDayType(dayData);

    if (type === "vuelo") {
      depFirst = dayData.flights[0].depTime;
      const lastFlight = dayData.flights[dayData.flights.length - 1];
      end = lastFlight.checkout || lastFlight.arrTime;
      label = `Jornada: ${depFirst} → ${end}`;
    } else if (type === "guardia" || type === "esm") {
      depFirst = "00:00";
      end = "23:59";
      label = `Actividad: ${dayData.note} (día completo)`;
    } else {
      return null; // libre
    }

    const [startH, startM] = depFirst.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startHour = startH + startM / 60;
    const endHour = endH + endM / 60;
    const totalHours = (endHour - startHour).toFixed(1);

    const blocks = Array.from({ length: 24 }, (_, h) => {
      const active = h >= Math.floor(startHour) && h < Math.ceil(endHour);
      return (
        <View
          key={h}
          style={[
            styles.hourBlock,
            active ? styles.activeBlock : styles.inactiveBlock,
          ]}
        >
          <Text style={styles.hourLabel}>{h}:00</Text>
        </View>
      );
    });

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>
          {label} ({totalHours}h)
        </Text>
        <View style={styles.timeline}>{blocks}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
   <Calendar
  markedDates={markedDates}
  markingType={"custom"}
  onDayPress={handleDayPress}
  theme={{
    selectedDayBackgroundColor: "#00adf5",
    todayTextColor: "#00adf5",
  }}
/>


   <ScrollView style={styles.infoBox}>
  {selectedDay ? (
    <>
      <Text style={styles.title}>
        {selectedDay.date} ({selectedDay.fullDate.split("T")[0]})
      </Text>

      {selectedDay.flights.length === 0 ? (
        <Text>🟦 Día libre</Text>
      ) : selectedDay.flights.some((f) => f.type === "GUA") ? (
        <Text>🟥 Guardia</Text>
      ) : selectedDay.flights.some((f) => f.type === "ESM") ? (
        <Text>🟧 ESM</Text>
      ) : (
        <Text>🟩 Trabajo ({selectedDay.flights.length} vuelos)</Text>
      )}

      {selectedDay.flights.map((f, i) => (
        <Text key={i}>
          - {f.type} {f.origin}→{f.destination} ({f.depTime} - {f.arrTime})
        </Text>
      ))}

      {renderTimeline(selectedDay)}
    </>
  ) : (
    <Text style={styles.empty}>Seleccioná un día</Text>
  )}
</ScrollView>

    </View>
  );
}
