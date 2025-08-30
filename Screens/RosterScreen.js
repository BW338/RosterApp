import React, { useEffect } from "react";
import { View, Text, SectionList, SafeAreaView } from "react-native";
import styles from "../Styles/RosterModalStyles";
import FlightCard from "../Components/FlightCard/FlightCard";

export default function RosterScreen({ route }) {
  const { roster } = route.params || { roster: [] };

  useEffect(() => {
    if (roster && roster.length > 0) {
      console.log("📌 Debug Roster (primeros 3 días):");
      roster.slice(0, 3).forEach((day, idx) => {
        console.log(`\n--- Día ${idx + 1}: ${day.date} ---`);
      });
    }
  }, [roster]);

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
