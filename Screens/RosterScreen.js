import { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, SectionList, SafeAreaView, Button, Switch, Platform } from "react-native";
import FlightCard from "../Components/FlightCard/FlightCard";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Controlar estilo de la TabBar (Toolbar inferior)
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#121212' : 'white',
            borderTopColor: isDarkMode ? '#272729' : '#E0E0E0',
          },
          tabBarActiveTintColor: isDarkMode ? '#AECBFA' : '#3983f1',
          tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : '#888',
        });
      }
    }, [isDarkMode, navigation])
  );

  // Botón en el header
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F2',
      },
      headerTitleStyle: {
        color: isDarkMode ? 'white' : 'black',
      },
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Platform.OS === 'ios' ? 10 : 0, gap: 5 }}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={isDarkMode ? '#FFD54F' : '#444'} />
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsDarkMode}
            value={isDarkMode}
          />
        </View>
      ),
      headerRight: () => (
        <Button
          title="Actualizar roster"
          onPress={() => navigation.navigate("RosterPannel")}
          color={Platform.OS === 'ios' ? (isDarkMode ? 'white' : '#007AFF') : undefined}
        />
      ),
    });
  }, [navigation, isDarkMode]);

  // Cargar roster (param o AsyncStorage)
useEffect(() => {
  const loadRoster = async () => {
    if (route.params?.roster?.length > 0) {
    //  console.log("📌 Roster cargado desde route.params:", route.params.roster);
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

  const containerStyles = [
    styles.container,
    isDarkMode && { backgroundColor: '#000' }
  ];

  const noteTextStyle = {
    fontSize: 14,
    fontWeight: "500",
    color: isDarkMode ? '#D3D3D3' : '#333'
  };

  return (
    <SafeAreaView style={containerStyles}>
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
      <View style={[getActivityStyle(item.activity, isDarkMode), { margin: 6 }]}>
        <Text style={noteTextStyle}>{item.note}</Text>
      </View>
    ) : (
      <FlightCard
        isDarkMode={isDarkMode}
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
    const headerTextStyle = [styles.sectionHeaderText, isDarkMode && { color: '#EAEAEA' }];

    return (
      <View
        style={[
          styles.sectionHeader,
          index % 2 === 0 ? (isDarkMode ? { backgroundColor: '#2C2C2E' } : styles.sectionHeaderEven) : (isDarkMode ? { backgroundColor: '#222224' } : styles.sectionHeaderOdd),
          today && (isDarkMode ? { backgroundColor: '#4A3700' } : styles.todaySection),
          { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        {/* Fecha izquierda */}
        <View>
          <Text style={headerTextStyle}>{formatDateShort(title)}</Text>
          <Text style={{ fontSize: 10, color: isDarkMode ? '#9E9E9E' : "#666", marginLeft: 4 }}>
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
            <Text style={[styles.sectionHeaderCheckin, isDarkMode && { color: '#B0B0B0' }]}>CkIn: {checkin}</Text>
          </View>
        )}

        {/* TE derecha */}
        {te && <Text style={[styles.sectionHeaderTotals, isDarkMode && { color: '#B0B0B0' }, getDynamicStyle(te, isDarkMode)]}>TE: {te}</Text>}
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