import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f285a",
  },
  sectionHeaderExtra: {
    fontSize: 13,
    color: "#555",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  route: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  flightNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
    color: "#444",
  },
  time: {
    fontSize: 13,
    color: "#666",
  },
  duration: {
    fontSize: 13,
    color: "#2f285a",
    fontWeight: "600",
  },
  aircraft: {
    fontSize: 13,
    color: "#333",
    marginTop: 2,
  },
  checkTime: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
});
