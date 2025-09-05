import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  infoBox: {
    flex: 1,
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  empty: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
  },
  timelineContainer: {
    marginTop: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  timeline: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hourBlock: {
    width: "12.5%", // 8 bloques por fila (24h = 3 filas)
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    borderRadius: 4,
  },
  inactiveBlock: {
    backgroundColor: "#eee",
  },
  activeBlock: {
    backgroundColor: "#4caf50",
  },
  hourLabel: {
    fontSize: 10,
    color: "#333",
  },
  freeDayBox: {
  marginTop: 20,
  padding: 20,
  backgroundColor: "#e6f7ff",
  borderRadius: 10,
  alignItems: "center",
},
freeDayText: {
  fontSize: 20,
  fontWeight: "600",
  color: "#0077b6",
},

});
