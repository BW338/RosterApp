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
    if (!day) return "libre";
    if (day.flights?.some(f => f.type === "OP" || /^AR\d+/.test(f.flightNumber))) return "vuelo";
    if (day.note === "GUA") return "guardia";
    if (day.note === "ESM") return "esm";
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

  // Render timeline de vuelos/guardias
const renderTimeline = (dayData) => {
  if (!dayData) return null;
  const type = getDayType(dayData);
  let depFirst, end;

  if (type === "vuelo") {
    const lastFlight = dayData.flights[dayData.flights.length - 1];
    end = lastFlight?.checkout || lastFlight?.arrTime;
    // Si el día tiene checkin, es el día de salida. Si no, es el de llegada.
    depFirst = dayData.checkin || (dayData.flights.length > 0 ? "00:00" : null);
  } else if (type === "guardia" || type === "esm") {
    depFirst = "00:00";
    end = "23:59";
  } else {
    // 🛑 Día libre o sin actividad → no dibujar timeline
    return (
      <Text style={{ textAlign: "center", marginVertical: 10, color: "#666" }}>
        No hay actividad para este día
      </Text>
    );
  }

  // ✅ Si todavía falta algo → salir
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

const formatFlightInfo = (day) => {
  if (!day) return "";
  if (!day.flights?.length && !day.checkin) {
    return "Sin actividad";
  }

  const firstFlight = day.flights?.[0];
  const lastFlight = day.flights?.[day.flights.length - 1];

  const checkin = day.checkin || firstFlight?.depTime || "--:--";
  const checkout = lastFlight?.checkout || lastFlight?.arrTime || "--:--";

  return `Checkin: ${checkin} | Fin: ${checkout}`;
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
            <Text style={styles.title}>
              {`${new Date(selectedDay.fullDate).toLocaleDateString("es-ES", { day: "2-digit", weekday: "long" }).replace(/^\w/, c => c.toUpperCase())} | ${formatFlightInfo(selectedDay)}`}
            </Text>

            {selectedDay.flights?.length > 0 ? (
              selectedDay.flights.map((f, i) => (
                <Text key={i} style={{ marginVertical: 0 }}>
                  {f.flightNumber} {f.origin} {f.depTime} - {f.arrTime} {f.destination}
                  {i === selectedDay.flights.length - 1 && (f.checkout || f.arrTime) ? ` | Fin: ${f.checkout || f.arrTime}` : ""}
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
