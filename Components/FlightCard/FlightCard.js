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

export default function FlightCard({ flight, isLastOfDay, tv, tsv, te }) {
  // Vuelo normal
  if (flight.type === "OP") {
    return (
      <View style={styles.card}>
        {/* Ruta */}
        <Text style={styles.route}>
          {flight.origin} ➡ {flight.destination}
        </Text>

        {/* Nro de vuelo */}
        <Text style={styles.flightNumber}>{flight.flightNumber}</Text>

        {/* Horarios + duración */}
        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {flight.depTime} - {flight.arrTime}
          </Text>
          <Text style={styles.duration}>
            {getDuration(flight.depTime, flight.arrTime)}
          </Text>
        </View>

      {/* Último tramo del día: equipo + totales */}
{isLastOfDay ? (
  <View style={styles.lastRow}>
    {flight.aircraft && (
      <Text style={styles.aircraft}>Equipo: {flight.aircraft}</Text>
    )}

    <View style={styles.totalsRow}>
      {/* {te && <Text style={styles.totals}>TE: {te}</Text>} */}
      {tsv && <Text style={styles.totals}>TSV: {tsv}</Text>}
      {tv && <Text style={styles.totals}>TV: {tv}</Text>}
    </View>
  </View>
) : (
  // Para tramos intermedios solo mostramos el equipo normal
  flight.aircraft && (
    <Text style={styles.aircraft}>Equipo: {flight.aircraft}</Text>
  )
)}

      </View>
    );
  }

  // Actividades especiales
  if (flight.type) {
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
  }

  // Notas
  if (flight.note) {
    return (
      <View style={styles.card}>
        <Text style={styles.note}>{flight.note}</Text>
      </View>
    );
  }

  return null;
}
