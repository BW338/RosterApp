import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function PrimaryButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled && { opacity: 0.5 }, // 🔹 opacidad cuando está deshabilitado
      ]}
      onPress={!disabled ? onPress : null} // 🔹 no ejecuta si está deshabilitado
      disabled={disabled} // 🔹 React Native lo reconoce igual
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
