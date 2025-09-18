import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadRosterFromStorage = async () => {
  try {
    const saved = await AsyncStorage.getItem("roster");
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("❌ Error en loadRoster:", err);
    return [];
  }
};

export const clearAllData = async () => {
  // Lista de todas las claves que la aplicación guarda en AsyncStorage
  const keys = ['roster', 'calendarData', 'selectedValues', 'calendarDataFlex', 'tasks'];
  try {
    await AsyncStorage.multiRemove(keys);
    console.log('Todos los datos han sido borrados de AsyncStorage.');
  } catch (e) {
    console.error('Falló al borrar todos los datos de AsyncStorage', e);
    // Re-lanzar el error para que el componente que llama pueda manejarlo (ej. mostrar un Toast)
    throw e;
  }
};
