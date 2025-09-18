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
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    color: '#1C1C1E', // Asegurar que el texto sea visible en modo claro
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    paddingVertical: 6,
  },
  todoText: {
    fontSize: 16,
    color: "#444",
    marginLeft: 12,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#a9a9a9',
  },
  todoEmpty: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 6,
  },
  // --- Dark Mode Styles ---
  todoContainerDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#48484A',
  },
  todoTitleDark: {
    color: '#FFFFFF',
  },
  todoInputDark: {
    backgroundColor: '#3A3A3C',
    borderColor: '#545458',
    color: '#FFFFFF',
  },
  todoItemDark: {
    backgroundColor: '#3A3A3C',
    shadowColor: '#000',
  },
  todoTextDark: {
    color: '#EAEAEA',
  },
  todoEmptyDark: {
    color: '#8E8E93',
  },
  todoTextCompletedDark: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
});
