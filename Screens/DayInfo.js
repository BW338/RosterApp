import React from "react";
import { View, Text } from "react-native";
import styles from "../Styles/CalendarScreenStyles";

const getDayType = (day) => {
  if (!day) return "libre";
  if (day.note === "GUA") return "guardia";
  if (day.note === "ESM") return "esm";
  if (day.flights?.length > 0) return "vuelo";
  return "libre";
};

const renderTimeline = (dayData) => {
  if (!dayData) return null;

  let depFirst, end, label;
  const type = getDayType(dayData);

  if (type === "vuelo") {
    depFirst = dayData.flights[0].depTime;
    const lastFlight = dayData.flights[dayData.flights.length - 1];
    end = lastFlight.checkout || lastFlight.arrTime;
    if (!depFirst || !end) return null;
    label = `Jornada: ${depFirst} → ${end}`;
  } else if (type === "guardia" || type === "esm") {
    depFirst = "00:00";
    end = "23:59";
    label = `Actividad: ${dayData.note} (día completo)`;
  } else {
    return (
      <View style={styles.freeDayBox}>
        <Text style={styles.freeDayText}>Día Libre</Text>
      </View>
    );
  }

  const [startH, startM] = depFirst.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startTotalMinutes = startH * 60 + startM;
  let endTotalMinutes = endH * 60 + endM;

  // Manejar cruce de medianoche
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }

  const totalDurationHours = (endTotalMinutes - startTotalMinutes) / 60;

  const blocks = Array.from({ length: 24 }, (_, h) => {
    const hourStartMinutes = h * 60;
    const hourEndMinutes = (h + 1) * 60;
    const active = hourStartMinutes < endTotalMinutes && hourEndMinutes > startTotalMinutes;

    return (
      <View
        key={h}
        style={[
          styles.hourBlock,
          active ? styles.activeBlock : styles.inactiveBlock,
        ]}
      >
        <Text style={styles.hourLabel}>{h}</Text>
      </View>
    );
  });

  return (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>
        {label} ({totalDurationHours.toFixed(1)}h)
      </Text>
      <View style={styles.timeline}>{blocks}</View>
    </View>
  );
};

export default function DayInfo({ dayData }) {
  if (!dayData) {
    return <Text style={styles.empty}>Seleccioná un día para ver el detalle</Text>;
  }

  const date = new Date(dayData.fullDate);
  // Ajuste para evitar problemas de zona horaria al mostrar
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

  const title = `${adjustedDate.toLocaleDateString("es-ES", {
    day: "2-digit",
  })} de ${adjustedDate.toLocaleDateString("es-ES", {
    month: "long",
  })} - ${adjustedDate
    .toLocaleDateString("es-ES", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase())}`;

  return (
    <>
      <Text style={styles.title}>{title}</Text>

      {dayData.flights && dayData.flights.length > 0 && getDayType(dayData) === 'vuelo' && (
        <View style={{marginBottom: 10}}>
          {dayData.flights.map((f, i) => (
            <Text key={i} style={styles.flightInfo}>
              <Text style={{fontWeight: 'bold'}}>{f.flightNumber || f.type}</Text> {f.origin} → {f.destination} ({f.depTime} - {f.arrTime})
            </Text>
          ))}
        </View>
      )}

      {renderTimeline(dayData)}
    </>
  );
}
