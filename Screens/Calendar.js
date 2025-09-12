import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../Styles/CalendarScreenStyles";
import ToDoList from "../Components/ToDoList/ToDoList.js";

const COLORS = {
  libre: { bg: "rgba(0, 255, 0, 0.15)", border: "#3cff00ff" },
  trabajo: { bg: "rgba(204, 194, 57, 0.15)", border: "#c7b834ff" },
  gua: { bg: "rgba(255,59,48,0.15)", border: "#FF3B30" },
  esm: { bg: "rgba(255,149,0,0.15)", border: "#FF9500" },
};

// Iconos y símbolos para cada tipo de actividad
const ACTIVITY_SYMBOLS = {
  vuelo: "🛫",
  gua: "🟠",
  esm: "📚",
  tof: "☀️",
  "*": "☀️",
  "d/l": "☀️",
  vac: "🏖️",
  med: "🚑",
  off: "☀️",
  rest: "☀️",
  htl: "🏨",
  vop: "⛱️",
  eld: "💻"
};


const getDayType = (day) => {
  if (!day || !day.flights || day.flights.length === 0) return "libre";
  const firstActivity = day.flights[0];

  if (firstActivity.type === "OP" || (firstActivity.flightNumber && /^AR\d+/.test(firstActivity.flightNumber))) {
    return "vuelo";
  }
  if (["*", "D/L", "VAC", "MED", "OFF", "REST"].includes(firstActivity.type)) {
    return "libre";
  }
  // Para GUA, ESM, TOF, etc., devuelve el tipo mismo
  return firstActivity.type;
};

// Render timeline de vuelos/guardias
const renderTimeline = (dayData) => {
  if (!dayData) return null;
  const type = getDayType(dayData);
  let depFirst, end;

  switch (type) {
    case "libre":
      depFirst = "00:00";
      end = "00:00";
      break;
    case "vuelo": {
      const lastFlight = dayData.flights[dayData.flights.length - 1];
      end = lastFlight?.checkout || lastFlight?.arrTime;
      depFirst = dayData.checkin || (dayData.flights.length > 0 ? "00:00" : null);
      break;
    }
    case "GUA":
      depFirst = "00:00";
      end = "23:59";
      break;
    case "ESM": {
      const raw = dayData.flights[0]?.raw;
      const times = raw?.match(/\d{1,2}:\d{2}/g);
      if (times && times.length >= 2) {
        depFirst = times[0];
        end = times[times.length - 1];
      } else {
        depFirst = "00:00";
        end = "23:59";
      }
      break;
    }
    default:
      return null; // No mostrar timeline para otras actividades especiales
  }

  if (!depFirst || !end) {
    return null;
  }

  const [startH, startM] = depFirst.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startHour = startH + startM / 60;
  const endHour = endH + endM / 60;
  const isOvernight = endHour < startHour;

  const blocks = Array.from({ length: 24 }, (_, h) => {
    let active = false;
    if (isOvernight && dayData.checkin) {
      active = h >= Math.floor(startHour);
    } else {
      active = h >= Math.floor(startHour) && h < Math.ceil(endHour);
    }
    return (
      <View key={h} style={[styles.hourBlock, active ? styles.activeBlock : styles.inactiveBlock]}>
        <Text style={styles.hourLabel}>{h.toString().padStart(2, "0")}</Text>
      </View>
    );
  });

  const row1 = blocks.slice(0, 8);
  const row2 = blocks.slice(8, 16);
  const row3 = blocks.slice(16, 24);

  return (
    <View style={styles.timelineContainer}>
      <View style={styles.timeline}>
        <View style={styles.timelineRow}>{row1}</View>
        <View style={styles.timelineRow}>{row2}</View>
        <View style={styles.timelineRow}>{row3}</View>
      </View>
    </View>
  );
};

export default function CalendarScreen() {
  const [roster, setRoster] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});

  // Cargar roster desde AsyncStorage
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

  // Cargar tareas desde AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (err) {
      console.log("❌ Error cargando tasks:", err);
    }
  };

  useEffect(() => { loadRoster(); loadTasks(); }, []);
  useFocusEffect(useCallback(() => { loadRoster(); loadTasks(); }, []));

  // Seleccionar día actual
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const found = roster.find((d) => d.fullDate?.startsWith(today));
    setSelectedDay(found || null);
  }, [roster]);

  // Marcar días en calendario
  const generateMarks = (data) => {
    const marks = {};
    data.forEach((day) => {
      const date = day.fullDate?.split("T")[0];
      if (!date) return;

      let estado = "libre";
      if (day.flights?.some(f => f.type === "GUA")) estado = "gua";
      else if (day.flights?.some(f => f.type === "ESM")) estado = "esm";
      else if (day.flights?.some(f => f.type === "OP" || f.type.startsWith("AR"))) estado = "trabajo";

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
    const found = roster.find((d) => d.fullDate?.startsWith(day.dateString));
    console.log("🗓️ Día seleccionado:", day.dateString);
    console.log("🔍 Datos encontrados para el día:", JSON.stringify(found, null, 2));
    setSelectedDay(found || null);
  };

  // Función simplificada solo para el título
  const formatDayTitleSimple = (day) => {
    if (!day) return "";

    const dayName = new Date(day.fullDate).toLocaleDateString("es-ES", { 
      day: "2-digit", 
      weekday: "long" 
    }).replace(/^\w/, c => c.toUpperCase());

    const type = getDayType(day);
    const firstActivity = day.flights?.[0];
    
    let symbol = "";
    let activityText = "";

    if (type === "libre") {
      symbol = "😴";
      activityText = "Libre";
    } else if (type === "vuelo") {
      symbol = ACTIVITY_SYMBOLS.vuelo;
      activityText = "Vuelo";
    } else {
      const activityType = firstActivity?.type?.toLowerCase();
      symbol = ACTIVITY_SYMBOLS[activityType] || ACTIVITY_SYMBOLS[type] || "📋";
      activityText = firstActivity?.type || type.toUpperCase();
    }

    return `${symbol} ${dayName} ${activityText}`;
  };

  // Función separada para renderizar los horarios
  const renderTimeInfo = (day) => {
    if (!day) return null;

    const type = getDayType(day);
    if (type === "libre") return null;

    const checkin = day.checkin;
    const lastFlight = day.flights?.[day.flights.length - 1];
    const checkout = lastFlight?.checkout || lastFlight?.arrTime;

    if (!checkin && !checkout) return null;

    return (
      <View style={styles.timeInfoHorizontal}>
        {checkin && (
          <View style={styles.timeColumn}>
            <Text style={styles.timeValue}>{checkin}</Text>
            <Text style={styles.timeLabel}>checkin</Text>
          </View>
        )}
        {checkin && checkout && (
          <Text style={styles.timeSeparator}>|</Text>
        )}
        {checkout && (
          <View style={styles.timeColumn}>
            <Text style={styles.timeValue}>{checkout}</Text>
            <Text style={styles.timeLabel}>fin</Text>
          </View>
        )}
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
        markingType="custom"
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: "#673ab7",
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
            <View style={styles.dayHeaderContainer}>
              <View style={styles.dayTitleSection}>
                <Text style={styles.dayTitle}>{formatDayTitleSimple(selectedDay)}</Text>
              </View>
              <View style={styles.timeInfoSection}>
                {renderTimeInfo(selectedDay)}
              </View>
            </View>

            {selectedDay.flights?.length > 0 ? (
              selectedDay.flights.map((f, i) => (
                <Text key={i} style={styles.flightDetails}>
                  {f.flightNumber} {f.origin} {f.depTime} - {f.arrTime} {f.destination}
                </Text>
              ))
            ) : (
              <Text style={styles.empty}>Sin vuelos ni actividad</Text>
            )}

            {renderTimeline(selectedDay)}

            <ToDoList selectedDay={selectedDay} tasks={tasks} setTasks={setTasks} />
          </>
        ) : (
          <Text style={styles.empty}>Seleccioná un día</Text>
        )}
      </ScrollView>
    </View>
  );
}