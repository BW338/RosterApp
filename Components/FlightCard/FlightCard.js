// src/Components/FlightCard.js
import React from "react";
import { View, Text } from "react-native";
import styles from "../../Styles/FlightCardStyles";

// helper: calcula duración entre horas tipo "10:20" y "13:45"
function getDuration(dep, arr) {
  if (!dep || !arr) return "";
  try {
    const [dh, dm] = dep.split(":").map(Number);
    const [ah, am] = arr.split(":").map(Number);

    const depDate = new Date(2000, 0, 1, dh, dm);
    const arrDate = new Date(2000, 0, 1, ah, am);

    // si llegada es menor que salida => vuelo cruza medianoche
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
  if (flight.type) {
    return (
      <View style={styles.card}>
        {/* Ruta */}
        <Text style={styles.route}>
          {flight.origin} ➡ {flight.destination}
        </Text>

        {/* Número (sin "OP") */}
        <Text style={styles.flightNumber}>
          {flight.type.replace("OP", "").trim()} {flight.flightNumber || ""}
        </Text>

        {/* Horarios + duración alineada a la derecha */}
        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {flight.depTime} - {flight.arrTime}
          </Text>
          <Text style={styles.duration}>{getDuration(flight.depTime, flight.arrTime)}</Text>
        </View>

        {/* Equipo */}
        {flight.aircraft && <Text style={styles.aircraft}>Equipo: {flight.aircraft}</Text>}
      </View>
    );
  } else {
    return (
      <View style={styles.card}>
        <Text style={styles.note}>{flight.note}</Text>
      </View>
    );
  }
}
