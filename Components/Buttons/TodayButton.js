import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../Styles/TodayButtonStyles";

export default function TodayButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.todayButton}>
      <Text style={styles.todayButtonText}>Hoy</Text>
    </TouchableOpacity>
  );
}
