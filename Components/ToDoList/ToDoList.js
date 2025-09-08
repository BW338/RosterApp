import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../Styles/ToDoListStyles";

export default function ToDoList({ selectedDay, tasks, setTasks }) {
  const [newTask, setNewTask] = useState("");

  const dateKey = selectedDay?.fullDate.split("T")[0];

  // Guardar tareas en AsyncStorage
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (err) {
      console.log("❌ Error guardando tasks:", err);
    }
  };

  const addTask = () => {
    if (!newTask.trim() || !selectedDay) return;
    const updated = {
      ...tasks,
      [dateKey]: [...(tasks[dateKey] || []), newTask.trim()],
    };
    setTasks(updated);
    saveTasks(updated);
    setNewTask("");
  };

  const removeTask = (index) => {
    if (!selectedDay) return;
    const updated = {
      ...tasks,
      [dateKey]: tasks[dateKey].filter((_, i) => i !== index),
    };
    setTasks(updated);
    saveTasks(updated);
  };

  const dateTasks = dateKey ? tasks[dateKey] || [] : [];

  if (!selectedDay) return null;

  return (
    <View style={styles.todoContainer}>
      <Text style={styles.todoTitle}>To Do List</Text>

      <View style={styles.todoInputContainer}>
        <TextInput
          style={styles.todoInput}
          placeholder="Agregar tarea..."
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <Button title="Añadir" onPress={addTask} />
      </View>

      {dateTasks.map((t, i) => (
        <View key={i} style={styles.todoItem}>
          <Text style={styles.todoText}>• {t}</Text>
          <Button title="❌" onPress={() => removeTask(i)} />
        </View>
      ))}

      {dateTasks.length === 0 && <Text style={styles.todoEmpty}>Sin tareas</Text>}
    </View>
  );
}
