import { useEffect, useState, useRef } from "react";
import { View, Text, SectionList, SafeAreaView, Button } from "react-native";
import FlightCard from "../Components/FlightCard/FlightCard";
import { formatDateShort } from "../Helpers/date";
import { scrollToToday } from "../Helpers/scrollHelpers";
import TodayButton from "../Components/Buttons/TodayButton";
import styles from "../Styles/RosterScreenStyles";
import { subtractMinutes, isToday } from "../Helpers/dateUtils";
import { getDynamicStyle } from "../Helpers/styleUtils";

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
          sections={roster.map(d => ({
            title: d.date,
            tv: d.tv,
            tsv: d.tsv,
            data: d.flights.length > 0 ? d.flights : [{ note: d.note }],
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index, section }) => (
            <FlightCard
              flight={item}
              isLastOfDay={index === section.data.length - 1} // 👉 último tramo del día
              tv={section.tv}
              tsv={section.tsv}
              te={section.te}
            />
          )}
          renderSectionHeader={({ section: { title, tv, tsv }, index }) => {
            const te = subtractMinutes(tsv, 30);
            const today = isToday(title);

            return (
              <View
                style={[
                  styles.sectionHeader,
                  index % 2 === 0 ? styles.sectionHeaderEven : styles.sectionHeaderOdd,
                  today && styles.todaySection 
                ]}
              >
                <Text style={styles.sectionHeaderText}>
                  {formatDateShort(title)}
                </Text>

                <View style={styles.totalsContainer}>
                  {te && (
                    <Text style={[styles.sectionHeaderTotals, getDynamicStyle(te)]}>
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
