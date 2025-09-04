import { useEffect, useState, useRef } from "react";
import { View, Text, SectionList, SafeAreaView, Button } from "react-native";
import FlightCard from "../Components/FlightCard/FlightCard";
import { formatDateShort } from "../Helpers/dateInSpanish";
import { scrollToToday } from "../Helpers/scrollHelpers";
import TodayButton from "../Components/Buttons/TodayButton";
import { subtractMinutes, isToday, isTodayStrict } from "../Helpers/today";
import { getDynamicStyle } from "../Helpers/styleUtils";
import { getActivityStyle } from "../Helpers/activityStyleUtils";
import { loadRosterFromStorage } from "../Helpers/StorageUtils"; 
import styles from "../Styles/RosterScreenStyles";

export default function RosterScreen({ navigation, route }) {
  const [roster, setRoster] = useState([]);
  const sectionListRef = useRef(null);

  // Scroll automático al abrir
  useEffect(() => {
    if (roster.length > 0) {
      setTimeout(() => {
        scrollToToday(roster, sectionListRef);
      }, 300);
    }
  }, [roster]);

  // Botón en el header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Actualizar roster"
          onPress={() => navigation.navigate("RosterPannel")}
        />
      ),
    });
  }, [navigation]);

  // Cargar roster (param o AsyncStorage)
  useEffect(() => {
    const loadRoster = async () => {
      if (route.params?.roster?.length > 0) {
        setRoster(route.params.roster);
      } else {
        const saved = await loadRosterFromStorage();
        if (saved.length > 0) setRoster(saved);
      }
    };
    loadRoster();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <SectionList
          ref={sectionListRef}
          sections={roster.map((d) => ({
            title: d.date,
            fullDate: d.fullDate, // 1. Pasamos fullDate a la sección
            tv: d.tv,
            tsv: d.tsv,
            te: d.te,
            data:
              d.flights.length > 0
                ? d.flights
                : [{ note: d.note, activity: d.note }], // 👉 activity agregado
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index, section }) =>
            item.note ? (
              <View style={[getActivityStyle(item.activity), { margin: 6 }]}>
                <Text style={{ fontSize: 14, fontWeight: "500" }}>
                  {item.note}
                </Text>
              </View>
            ) : (
              <FlightCard
                flight={item}
                isLastOfDay={index === section.data.length - 1}
                tv={section.tv}
                tsv={section.tsv}
                te={section.te}
              />
            )
          }
      renderSectionHeader={({ section: { title, fullDate, tv, tsv }, index }) => {
  const te = subtractMinutes(tsv, 30);
  const today = isTodayStrict(fullDate); // 👈 ahora compara con fecha completa

  return (
    <View
      style={[
        styles.sectionHeader,
        index % 2 === 0
          ? styles.sectionHeaderEven
          : styles.sectionHeaderOdd,
        today && styles.todaySection, // 👈 se pinta solo si es HOY exacto
      ]}
    >
      <View>
        <Text style={styles.sectionHeaderText}>
          {formatDateShort(title)}
        </Text>

        <Text style={{ fontSize: 10, color: "#666", marginLeft: 4 }}>
          {(() => {
            const d = new Date(fullDate);
            const mes = d.toLocaleDateString("es-ES", { month: "long" });
            return mes.charAt(0).toUpperCase() + mes.slice(1);
          })()}
        </Text>
      </View>

      <View style={styles.totalsContainer}>
        {te && (
          <Text
            style={[styles.sectionHeaderTotals, getDynamicStyle(te)]}
          >
            TE: {te}
          </Text>
        )}
      </View>
    </View>
  );
}}

        />
        <TodayButton onPress={() => scrollToToday(roster, sectionListRef)} />
      </View>
    </SafeAreaView>
  );
}