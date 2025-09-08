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
const [hasScrolled, setHasScrolled] = useState(false);
  // Scroll automático al abrir
useEffect(() => {
  if (roster.length > 0 && !hasScrolled) {
    const timer = setTimeout(() => {
      scrollToToday(roster, sectionListRef);
      setHasScrolled(true); // ✅ solo una vez
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [roster, hasScrolled]);


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
      console.log("📌 Roster cargado desde route.params:", route.params.roster);
      setRoster(route.params.roster);
    } else {
      const saved = await loadRosterFromStorage();
      if (saved.length > 0) {
       // console.log("💾 Roster cargado desde AsyncStorage:", saved);
        setRoster(saved);
      } else {
        console.log("⚠️ No se encontró roster en params ni en AsyncStorage");
      }
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
    fullDate: d.fullDate, 
    tv: d.tv,
    tsv: d.tsv,
    checkin: d.checkin,
    te: d.te,
    data: d.flights?.length > 0
      ? d.flights
      : [{ note: d.note, activity: d.note }],
  }))}
  keyExtractor={(item, index) => index.toString()}

  renderItem={({ item, index, section }) => {
    if (!section) return null; // 🔹 evita crash si section es undefined
    return item.note ? (
      <View style={[getActivityStyle(item.activity), { margin: 6 }]}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>{item.note}</Text>
      </View>
    ) : (
      <FlightCard
        flight={item}
        isLastOfDay={index === (section.data?.length || 0) - 1} // 🔹 seguridad extra
        tv={section.tv}
        tsv={section.tsv}
        te={section.te}
      />
    );
  }}

  renderSectionHeader={({ section, index }) => {
    if (!section) return null;
    const { title, fullDate, tv, tsv, checkin } = section;
    const te = subtractMinutes(tsv, 30);
    const today = isTodayStrict(fullDate);

    return (
      <View
        style={[
          styles.sectionHeader,
          index % 2 === 0 ? styles.sectionHeaderEven : styles.sectionHeaderOdd,
          today && styles.todaySection,
          { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        {/* Fecha izquierda */}
        <View>
          <Text style={styles.sectionHeaderText}>{formatDateShort(title)}</Text>
          <Text style={{ fontSize: 10, color: "#666", marginLeft: 4 }}>
            {(() => {
              const d = new Date(fullDate);
              const mes = d.toLocaleDateString("es-ES", { month: "long" });
              return mes.charAt(0).toUpperCase() + mes.slice(1);
            })()}
          </Text>
        </View>

        {/* Check-in centro */}
        {checkin && (
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.sectionHeaderCheckin}>CkIn: {checkin}</Text>
          </View>
        )}

        {/* TE derecha */}
        {te && <Text style={[styles.sectionHeaderTotals, getDynamicStyle(te)]}>TE: {te}</Text>}
      </View>
    );
  }}

  // 🔹 Scroll automático solo la primera vez que la lista se carga
  // onContentSizeChange={() => {
  //   if (!hasScrolled && roster.length > 0) {
  //     setTimeout(() => {
  //       scrollToToday(roster, sectionListRef);
  //       setHasScrolled(true);
  //     }, 500);
  //   }
  // }}

  onScrollToIndexFailed={(info) => {
    console.warn("⚠️ Scroll fallido, reintentando...", info);
    setTimeout(() => {
      if (sectionListRef.current && roster.length > 0) {
        const safeIndex = Math.min(info.index, roster.length - 1);
        sectionListRef.current.scrollToLocation({
          sectionIndex: safeIndex,
          itemIndex: 0,
          animated: true,
          viewPosition: 0,
        });
      }
    }, 500);
  }}
/>

        <TodayButton onPress={() => scrollToToday(roster, sectionListRef)} />
      </View>
    </SafeAreaView>
  );
}