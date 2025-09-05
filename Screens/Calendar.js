import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../Styles/CalendarScreenStyles";

export default function CalendarScreen() {
  const [roster, setRoster] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const loadRoster = async () => {
      try {
        const saved = await AsyncStorage.getItem("roster");
        if (saved) {
          const parsed = JSON.parse(saved);
          setRoster(parsed);
          generateMarks(parsed);
        }
      } catch (err) {
        console.log("❌ Error cargando roster:", err);
      }
    };
    loadRoster();
  }, []);

  // 👉 Determina si el día es de trabajo
  const isWorkDay = (day) => {
    if (!day) return false;

    if (day.flights && day.flights.some(f => f.type === "OP" || /^AR\d+/.test(f.flightNumber))) {
      return true;
    }
    if (day.note === "GUA" || day.note === "ESM") {
      return true;
    }
    return false;
  };

  const generateMarks = (data) => {
    const marks = {};
    data.forEach((day) => {
      if (day.fullDate) {
        const dateKey = day.fullDate.split("T")[0];
        marks[dateKey] = {
          marked: true,
          dotColor: isWorkDay(day) ? "red" : "blue", // 🔴 trabajo, 🔵 libre
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

    if (dayData.flights && dayData.flights.length > 0) {
      // caso vuelos
      depFirst = dayData.flights[0].depTime;
      const lastFlight = dayData.flights[dayData.flights.length - 1];
      end = lastFlight.checkout || lastFlight.arrTime;
      label = `Jornada: ${depFirst} → ${end}`;
    } else if (dayData.note === "GUA" || dayData.note === "ESM") {
      // caso guardia o ESM
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
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: "#00adf5",
          todayTextColor: "#00adf5",
          dotColor: "#00adf5",
        }}
      />

      <ScrollView style={styles.infoBox}>
        {selectedDay ? (
          <>
            <Text style={styles.title}>
              {selectedDay.date} ({selectedDay.fullDate.split("T")[0]})
            </Text>

            {isWorkDay(selectedDay) ? (
              <>
                {selectedDay.flights?.length > 0 && (
                  <>
                    <Text>✈️ Vuelos: {selectedDay.flights.length}</Text>
                    {selectedDay.flights.map((f, i) => (
                      <Text key={i}>
                        - {f.flightNumber} {f.origin}→{f.destination} ({f.depTime} -{" "}
                        {f.arrTime})
                      </Text>
                    ))}
                  </>
                )}
                {renderTimeline(selectedDay)}
              </>
            ) : (
              <View style={styles.freeDayBox}>
                <Text style={styles.freeDayText}>🌴 Día Libre</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.empty}>Seleccioná un día</Text>
        )}
      </ScrollView>
    </View>
  );
}
