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
  rest: "💤",
  htl: "🏨",
  vop: "⛱️",
  eld: "💻"
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

  const getDayType = (day) => {
    if (!day || !day.flights || day.flights.length === 0) return "libre";
    const firstActivity = day.flights[0];

    if (firstActivity.type === "OP" || (firstActivity.flightNumber && /^AR\d+/.test(firstActivity.flightNumber))) {
      return "vuelo";
    }
    // Devolver el tipo de actividad especial en minúsculas
    if (["GUA", "ESM", "TOF", "ELD", "HTL", "VOP"].includes(firstActivity.type)) {
      return firstActivity.type.toLowerCase();
    }
    if (["*", "D/L", "VAC", "MED", "OFF", "REST"].includes(firstActivity.type)) {
      return firstActivity.type.toLowerCase();
    }
    return "libre";
  };

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

  // Render timeline de vuelos/guardias
  const renderTimeline = (dayData) => {
    if (!dayData) return null;
    const type = getDayType(dayData);
    let depFirst, end;

    if (type === "libre") {
      // Día libre, mostrar timeline vacía
      depFirst = "00:00";
      end = "00:00";
    } else if (type === "vuelo") {
      const lastFlight = dayData.flights[dayData.flights.length - 1];
      end = lastFlight?.checkout || lastFlight?.arrTime;
      // Si el día tiene checkin, es el día de salida. Si no, es el de llegada.
      depFirst = dayData.checkin || (dayData.flights.length > 0 ? "00:00" : null);
    } else if (type === "gua") {
      depFirst = "00:00";
      end = "23:59";
    } else if (type === "esm") {
      const raw = dayData.flights[0]?.raw;
      if (raw) {
        const times = raw.match(/\d{1,2}:\d{2}/g);
        if (times && times.length >= 2) {
          depFirst = times[0];
          end = times[times.length - 1];
        }
      }
      // Fallback por si falla el parseo del raw
      if (!depFirst) {
        depFirst = "00:00";
        end = "23:59";
      }
    } else {
      // Día libre o sin actividad → no dibujar timeline
      return (
        <Text style={{ textAlign: "center", marginVertical: 10, color: "#666" }}>
          Sin actividad programada
        </Text>
      );
    }

    // Si todavía falta algo → salir
    if (!depFirst || !end) {
      return (
        <Text style={{ textAlign: "center", marginVertical: 10, color: "#666" }}>
          Sin horarios definidos
        </Text>
      );
    }

    const [startH, startM] = depFirst.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const startHour = startH + startM / 60;
    const endHour = endH + endM / 60;

    const isOvernight = endHour < startHour;

    const blocks = Array.from({ length: 24 }, (_, h) => {
      let active = false;
      if (isOvernight && dayData.checkin) {
        // Es un servicio nocturno, y estamos en el día de SALIDA.
        // Marcar desde el check-in hasta el final del día.
        active = h >= Math.floor(startHour);
      } else {
        // Es un servicio diurno, O estamos en el día de LLEGADA de un nocturno.
        // Marcar desde la hora de inicio hasta la de fin.
        active = h >= Math.floor(startHour) && h < Math.ceil(endHour);
      }
      return (
        <View
          key={h}
          style={[styles.hourBlock, active ? styles.activeBlock : styles.inactiveBlock]}
        >
          <Text style={styles.hourLabel}>{h}:00</Text>
        </View>
      );
    });

    return (
      <View style={styles.timelineContainer}>
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