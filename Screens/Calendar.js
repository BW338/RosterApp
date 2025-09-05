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
      const date = day.fullDate.split("T")[0];

      let estado = "libre"; // por defecto libre
      if (day.flights.some((f) => f.type === "GUA")) estado = "gua";
      else if (day.flights.some((f) => f.type === "ESM")) estado = "esm";
      else if (day.flights.some((f) => f.type === "OP" || f.type.startsWith("AR")))
        estado = "trabajo";

      marks[date] = {
        customStyles: {
          container: {
            backgroundColor: COLORS[estado].bg,
            borderColor: COLORS[estado].border,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          text: {
            color: "#222",
            fontWeight: "600",
          },
        },
      };
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
        text: {
          color: "#333",
          fontWeight: "600",
        },
      },
    },
  }}
        markingType={"custom"}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: "#673ab7",
          arrowColor: "#673ab7",
          monthTextColor: "#333",
          textDayFontWeight: "500",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 14,
            textDayFontWeight: "bold",
          textDayHeaderFontSize: 18 ,
          textMonthFontSize: 18,
          textSectionTitleColor: "#333",
        }}
        firstDay={1} // lunes
        dayNamesShort={["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]}
      />

{/* 🔹 Leyenda de colores */}
{/* <View style={styles.legend}>
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: "rgba(0,122,255,0.15)", borderColor: "#007AFF" }]} />
    <Text style={styles.legendText}>Día libre</Text>
  </View>
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: "rgba(52,199,89,0.15)", borderColor: "#34C759" }]} />
    <Text style={styles.legendText}>Trabajo</Text>
  </View>
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: "rgba(255,59,48,0.15)", borderColor: "#FF3B30" }]} />
    <Text style={styles.legendText}>Guardia</Text>
  </View>
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: "rgba(255,149,0,0.15)", borderColor: "#FF9500" }]} />
    <Text style={styles.legendText}>ESM</Text>
  </View>
</View> */}


<ScrollView style={styles.infoBox}>
  {selectedDay ? (
    <>
 <Text style={styles.title}>
  {`${new Date(selectedDay.fullDate).toLocaleDateString("es-ES", {
    day: "2-digit",
  })} ${new Date(selectedDay.fullDate)
    .toLocaleDateString("es-ES", { weekday: "long" })
    .charAt(0)
    .toUpperCase()}${new Date(selectedDay.fullDate)
    .toLocaleDateString("es-ES", { weekday: "long" })
    .slice(1)}`}
</Text>



      {selectedDay.flights.length === 0 ? (
        <Text>🟦 Día libre</Text>
      ) : selectedDay.flights.some((f) => f.type === "GUA") ? (
        <Text>🟥 Guardia</Text>
      ) : selectedDay.flights.some((f) => f.type === "ESM") ? (
        <Text>🟧 ESM</Text>
      ) : selectedDay.flights.some((f) => ["*", "TOF", "D/L"].includes(f.type)) ? (
        <Text>🟦 Día libre</Text>
      ) : null}

      {/* 👇 Ahora solo mostramos los vuelos sin la línea "Trabajo..." */}
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
