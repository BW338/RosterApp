import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import styles from "../../Styles/ToDoListStyles";

export default function ToDoList({ selectedDay, tasks, setTasks, isDarkMode, onNewTaskChange }) {
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
    const taskObject = { text: newTask.trim(), completed: false };
    const updated = {
      ...tasks,
      [dateKey]: [...(tasks[dateKey] || []), taskObject],
    };
    setTasks(updated);
    saveTasks(updated);
    setNewTask("");
    onNewTaskChange(""); // Limpiar la vista previa
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

  const toggleTask = (index) => {
    if (!selectedDay) return;
    const dayTasks = [...tasks[dateKey]];
    const taskToToggle = dayTasks[index];
    dayTasks[index] = { ...taskToToggle, completed: !taskToToggle.completed };
    
    const updated = {
      ...tasks,
      [dateKey]: dayTasks,
    };
    setTasks(updated);
    saveTasks(updated);
  };

  const handleTextChange = (text) => {
    setNewTask(text);
    onNewTaskChange(text); // Actualizar la vista previa en el componente padre
  };

  const dateTasks = dateKey ? tasks[dateKey] || [] : [];

  if (!selectedDay) return null;

  return (
    <View style={[styles.todoContainer, isDarkMode && styles.todoContainerDark]}>
      <Text style={[styles.todoTitle, isDarkMode && styles.todoTitleDark]}>Tareas</Text>

      <View style={styles.todoInputContainer}>
        <TextInput
          style={[styles.todoInput, isDarkMode && styles.todoInputDark]}
          placeholder="Agregar tarea..."
          placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CD'}
          value={newTask}
          onChangeText={handleTextChange}
          onSubmitEditing={addTask}
        />
        <Button title="Añadir" onPress={addTask} color={isDarkMode ? '#AECBFA' : '#007AFF'} />
      </View>

      {/* Lista de tareas existentes */}
      {dateTasks.map((task, i) => (
        <View key={i} style={[styles.todoItem, isDarkMode && styles.todoItemDark]}>
          <TouchableOpacity onPress={() => toggleTask(i)} style={styles.taskContent}>
            <Ionicons 
              name={task.completed ? 'checkbox' : 'square-outline'} 
              size={24} 
              color={task.completed ? (isDarkMode ? '#8E8E93' : '#a9a9a9') : (isDarkMode ? '#AECBFA' : '#007AFF')}
            />
            <Text style={[styles.todoText, isDarkMode && styles.todoTextDark, task.completed && (isDarkMode ? styles.todoTextCompletedDark : styles.todoTextCompleted)]}>
              {task.text}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => removeTask(i)}>
            <Ionicons name="trash-bin-outline" size={20} color={isDarkMode ? '#FF453A' : '#FF3B30'} />
          </TouchableOpacity>
        </View>
      ))}

      {dateTasks.length === 0 && (
        <Text style={[styles.todoEmpty, isDarkMode && styles.todoEmptyDark]}>
          Sin tareas para este día
        </Text>
      )}
    </View>
  );
}
