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

    // si llegada es menor que salida => cruza medianoche
    if (arrDate < depDate) arrDate.setDate(arrDate.getDate() + 1);

    const diffMs = arrDate - depDate;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs / (1000 * 60)) % 60);
    const formattedM = diffM.toString().padStart(2, "0");

    return `${diffH}:${formattedM}hs`;
  } catch {
    return "";
  }
}

export default function FlightCard({ flight, isLastOfDay, tv, tsv, te, isDarkMode }) {
  // Estilos dinámicos
  const cardStyle = [styles.card, isDarkMode && styles.cardDark];
  const routeStyle = [styles.route, isDarkMode && styles.routeDark];
  const textStyle = isDarkMode ? styles.textDark : {};
  const mutedTextStyle = isDarkMode ? styles.textDarkMuted : {};
  const durationStyle = [styles.duration, isDarkMode && styles.durationDark];

  // --- Actividades especiales ---
  const isSpecial = ["*", "ELD", "ESM", "GUA", "TOF", "D/L", "VAC", "MED", "HTL", "VOP"].includes(
    flight.type
  );

  if (isSpecial) {
   const activityStyle =
      flight.type === "GUA"
    ? [styles.guaActivity, isDarkMode && styles.guaActivityDark]
    : flight.type === "D/L"
    ? [styles.dlActivity, isDarkMode && styles.dlActivityDark]
    : [styles.specialActivity, isDarkMode && styles.specialActivityDark];

    return (
      <View style={cardStyle}>
        {/* Sigla grande centrada */}
        <Text style={activityStyle}>{flight.type}</Text>

        {/* Info opcional (ciudad / horarios si vienen) */}
        {flight.origin && <Text style={[styles.city, mutedTextStyle]}>{flight.origin}</Text>}

        {(flight.depTime || flight.arrTime) && (
          <Text style={[styles.time, textStyle]}>
            {flight.depTime || "--"} - {flight.arrTime || "--"}
          </Text>
        )}
        {/* NOTA: no mostramos duración en actividades especiales */}
      </View>
    );
  }

  // --- Vuelos normales (OP / ARxxxx) ---
  if (flight.type === "OP") {
    return (
      <View style={cardStyle}>
        {/* Ruta */}
        <Text style={routeStyle}>
          {flight.origin} ➡ {flight.destination}
        </Text>

        {/* Número de vuelo */}
        <Text style={[styles.flightNumber, textStyle]}>{flight.flightNumber}</Text>

        {/* Horarios + duración */}
        <View style={styles.timeRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.time, textStyle]}>
              {flight.depTime} - {flight.arrTime}
            </Text>
            {flight.checkout && (
              <Text style={[styles.checkout, mutedTextStyle]}> | Fin: {flight.checkout}</Text>
            )}
          </View>
          <Text style={durationStyle}>
            {getDuration(flight.depTime, flight.arrTime)}
          </Text>
        </View>

        {/* Último tramo del día: equipo + totales */}
        {isLastOfDay ? (
          <View style={styles.lastRow}>
            {flight.aircraft && (
              <Text style={[styles.aircraft, mutedTextStyle]}>Equipo: {flight.aircraft}</Text>
            )}

            <View style={styles.totalsRow}>
              {/* {te && <Text style={styles.totals}>TE: {te}</Text>} */}
              {tsv && <Text style={[styles.totals, mutedTextStyle]}>TSV: {tsv}</Text>}
              {tv && <Text style={[styles.totals, mutedTextStyle]}>TV: {tv}</Text>}
            </View>
          </View>
        ) : (
          // Tramos intermedios: solo equipo
          flight.aircraft && (
            <Text style={[styles.aircraft, mutedTextStyle]}>Equipo: {flight.aircraft}</Text>
          )
        )}
      </View>
    );
  }

  // --- Notas ---
  if (flight.note) {
    return (
      <View style={cardStyle}>
        <Text style={[styles.note, mutedTextStyle]}>{flight.note}</Text>
      </View>
    );
  }

  return null;
}
