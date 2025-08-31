import React from "react";
import { View, Text } from "react-native";
import styles from "../../Styles/FlightCardStyles";

function getDuration(dep, arr) {
  if (!dep || !arr) return "";
  try {
    const [dh, dm] = dep.split(":").map(Number);
    const [ah, am] = arr.split(":").map(Number);

    const depDate = new Date(2000, 0, 1, dh, dm);
    const arrDate = new Date(2000, 0, 1, ah, am);

    if (arrDate < depDate) arrDate.setDate(arrDate.getDate() + 1);

    const diffMs = arrDate - depDate;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${diffH}h ${diffM}m`;
  } catch {
    return "";
  }
}

export default function FlightCard({ flight }) {
  // Si es un vuelo tipo OP
  if (flight.type === "OP") {
    return (
      <View style={styles.card}>
        <Text style={styles.route}>
          {flight.origin} ➡ {flight.destination}
        </Text>
        <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {flight.depTime} - {flight.arrTime}
          </Text>
          <Text style={styles.duration}>{getDuration(flight.depTime, flight.arrTime)}</Text>
        </View>
        {flight.aircraft && <Text style={styles.aircraft}>Equipo: {flight.aircraft}</Text>}
      </View>
    );
  } else if (flight.type) {
    // Para actividades especiales (*, D/L, GUA, ESM, etc.)
    return (
      <View style={styles.card}>
        <Text style={styles.activity}>{flight.type}</Text>
        {flight.origin && <Text style={styles.city}>{flight.origin}</Text>}
        {(flight.depTime || flight.arrTime) && (
          <Text style={styles.time}>
            {flight.depTime || "--"} - {flight.arrTime || "--"}
          </Text>
        )}
      </View>
    );
  } else if (flight.note) {
    // Notas especiales
    return (
      <View style={styles.card}>
        <Text style={styles.note}>{flight.note}</Text>
      </View>
    );
  } else {
    return null;
  }
}
