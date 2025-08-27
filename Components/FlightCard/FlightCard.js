// src/Components/FlightCard.js
import React from "react";
import { View, Text } from "react-native";
import styles from "../../Styles/FlightCardStyles ";

export default function FlightCard({ flight }) {
  if (flight.type) {
    return (
      <View style={styles.card}>
        <Text style={styles.flightNumber}>{flight.type} {flight.flightNumber || ""}</Text>
        <Text style={styles.route}>{flight.origin} ➡ {flight.destination}</Text>
        <Text style={styles.time}>{flight.depTime} - {flight.arrTime}</Text>
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
