import React, { useEffect, useState } from "react";
import { View, Text, SectionList, SafeAreaView, Button } from "react-native";
import styles from "../Styles/RosterModalStyles";
import FlightCard from "../Components/FlightCard/FlightCard";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function RosterScreen({ route, navigation }) {
  const [roster, setRoster] = useState([]);

  // ⬆️ Configurar el encabezado con botón
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Actualizar roster" onPress={() => navigation.navigate("RosterView")} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadRoster = async () => {
      console.log("🔍 useEffect RosterScreen iniciado");

      try {
        // 1) Chequear si vino por params
        if (route.params?.roster && route.params.roster.length > 0) {
          console.log("✅ Roster recibido por params:", route.params.roster);
          setRoster(route.params.roster);
          return;
        } else {
          console.log("⚠️ No vino roster por params");
        }

        // 2) Chequear AsyncStorage
        const saved = await AsyncStorage.getItem("roster");
        console.log("📦 AsyncStorage contenido:", saved);

        if (saved) {
          const parsed = JSON.parse(saved);
          console.log("📌 Parsed roster del storage:", parsed);

          if (parsed.length > 0) {
            console.log("✅ Roster cargado desde storage");
            setRoster(parsed);
            return;
          } else {
            console.log("⚠️ Storage vacío (array sin datos)");
          }
        } else {
          console.log("⚠️ No hay nada en AsyncStorage");
        }

        // 3) Si no hay nada → mostrar pantalla vacía
        console.log("⚠️ No se encontró roster ni en params ni en storage");

      } catch (err) {
        console.error("❌ Error en loadRoster:", err);
      }
    };

    loadRoster();
  }, [route.params]);

  // mientras carga o no hay datos
  if (!roster || roster.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No hay roster cargado</Text>
        <Text>Usá el botón "Actualizar roster" arriba para cargarlo</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 10 }}>
        <SectionList
          sections={roster.map((d) => ({
            title: d.date,
            data: d.flights.length > 0 ? d.flights : [{ note: d.note }],
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <FlightCard flight={item} />}
          renderSectionHeader={({ section: { title }, index }) => (
            <View
              style={[
                styles.sectionHeader,
                index % 2 === 0
                  ? { backgroundColor: "#2f285a22" }
                  : { backgroundColor: "#00d66f22" },
              ]}
            >
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}