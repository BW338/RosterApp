import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f285a",
  },
  route: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  aircraft: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
  },
  sectionHeader: {
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
});
