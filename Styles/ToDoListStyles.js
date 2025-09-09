import { StyleSheet } from "react-native";

export default StyleSheet.create({
  todoContainer: {
    marginTop: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#333",
  },
  todoInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  todoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 32,
    marginRight: 6,
    backgroundColor: "#fff",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  todoText: {
    fontSize: 16,
    color: "#444",
  },
  todoEmpty: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 6,
  },
});
