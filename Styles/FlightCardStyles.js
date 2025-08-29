import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  route: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2f285a",
  },
  flightNumber: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
  duration: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00d66f",
  },
  aircraft: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
  },
});
