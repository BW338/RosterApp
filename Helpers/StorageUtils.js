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
