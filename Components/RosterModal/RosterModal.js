import {React, useEffect} from "react";
import { Modal, View, Text, SectionList, TouchableOpacity, SafeAreaView } from "react-native";
import styles from "../../Styles/RosterModalStyles";
import FlightCard from "../FlightCard/FlightCard";

export default function RosterModal({ visible, onClose, roster }) {


   useEffect(() => {
    if (roster && roster.length > 0) {
      console.log("📌 Debug Roster (primeros 3 días):");
      roster.slice(0, 3).forEach((day, idx) => {
        console.log(`\n--- Día ${idx + 1}: ${day.date} ---`);
        if (day.flights && day.flights.length > 0) {
          day.flights.forEach((f, i) => {
            console.log(
              ` Vuelo ${i + 1}:`,
              f.type, 
              f.flightNumber,
              f.origin,
              "➡",
              f.destination,
              `${f.depTime} - ${f.arrTime}`,
              f.aircraft ? `Equipo: ${f.aircraft}` : ""
            );
          });
        } else {
          console.log(" Nota:", day.note);
        }
      });
    }
  }, [roster]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, padding: 10 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ alignSelf: "flex-end", marginBottom: 10 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>✕ Cerrar</Text>
          </TouchableOpacity>

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
    </Modal>
  );
}
