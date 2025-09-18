import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { View, Text, SectionList, SafeAreaView, TouchableOpacity, Switch, Platform, StatusBar, Alert } from "react-native";
import FlightCard from "../Components/FlightCard/FlightCard";
import { Ionicons } from "@expo/vector-icons";
import { formatDateShort } from "../Helpers/dateInSpanish";
import TodayButton from "../Components/Buttons/TodayButton";
import { subtractMinutes, isToday, isTodayStrict } from "../Helpers/today";
import { getDynamicStyle } from "../Helpers/styleUtils";
import { getActivityStyle } from "../Helpers/activityStyleUtils";
import { loadRosterFromStorage, clearAllData } from "../Helpers/StorageUtils";
import styles from "../Styles/RosterScreenStyles";
import EmptyRoster from "../Components/EmptyRoster";
import Toast from "react-native-toast-message";

export default function RosterScreen({ navigation, route, isDarkMode, setIsDarkMode }) {
  const [roster, setRoster] = useState([]);
  const sectionListRef = useRef(null);
  const hasScrolledRef = useRef(false);

  // --- Refs para la estrategia de medición de altura ---
  const itemHeightsRef = useRef({});    // { [sectionIndex]: { [itemIndex]: height } }
  const headerHeightsRef = useRef({});  // { [sectionIndex]: height }
  const avgItemHeightRef = useRef(115); // Estimación inicial razonable
  const avgHeaderHeightRef = useRef(36);

  // --- Memoización de Secciones ---
  const sections = useMemo(() => {
    return roster.map((d, sectionIndex) => {
      const dataWithUids = (d.flights?.length > 0 ? d.flights : [{ note: d.note, activity: d.note }])
        .map((item, itemIndex) => ({
          ...item,
          __uid: `${sectionIndex}-${itemIndex}-${item.flightNumber || item.note}`,
        }));
      return { ...d, title: d.date, data: dataWithUids, sectionIndex };
    });
  }, [roster]);

  // --- Handlers para Medición ---
  const handleItemLayout = useCallback((sectionIndex, itemIndex, height) => {
    if (!itemHeightsRef.current[sectionIndex]) {
      itemHeightsRef.current[sectionIndex] = {};
    }
    itemHeightsRef.current[sectionIndex][itemIndex] = height;
  }, []);
  
  const handleHeaderLayout = useCallback((sectionIndex, height) => {
    headerHeightsRef.current[sectionIndex] = height;
  }, []);

  // --- Lógica de Scroll ---
  const scrollToToday = useCallback(() => {
    if (!sectionListRef.current || !sections.length) return;

    const todaySectionIndex = sections.findIndex(
      d => d.fullDate && isTodayStrict(new Date(d.fullDate))
    );

    if (todaySectionIndex === -1) {
      console.warn("⚠️ No se encontró la sección de hoy.");
      return;
    }

    const getOffset = () => {
      let offset = 0;
      for (let i = 0; i < todaySectionIndex; i++) {
        offset += headerHeightsRef.current[i] || avgHeaderHeightRef.current;
        
        const sectionItems = sections[i].data;
        const measuredItems = itemHeightsRef.current[i] || {};
        for (let j = 0; j < sectionItems.length; j++) {
          offset += measuredItems[j] || avgItemHeightRef.current;
        }
      }
      return offset;
    };

    // Estrategia de scroll por etapas para iOS
    const attemptScroll = (attempt = 1) => {
      const offset = getOffset();
      
      // `scrollToOffset` no está en la interfaz pública de SectionList, pero sí en su ScrollView interno.
      // Para accederlo de forma segura, usamos el "truco" de `getNode()`.
      const scrollResponder = sectionListRef.current.getScrollResponder();
      if (scrollResponder) {
        scrollResponder.scrollTo({ x: 0, y: offset, animated: true });
      }

      // En iOS, reintentamos para ajustar la posición después de que se midan más elementos.
      if (attempt === 1 && Platform.OS === 'ios') {
        setTimeout(() => attemptScroll(2), 400);
      }
    };

    attemptScroll();
  }, [sections]);

  const handleClearAllStorage = () => {
    Alert.alert(
      "Borrar Todos los Datos",
      "¿Estás seguro de que quieres borrar TODOS los datos de la aplicación (roster, viáticos, flex, etc.)? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar Todo",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              setRoster([]); // Limpiar estado local para reflejar el cambio en la UI
              Toast.show({ type: 'success', text1: 'Datos borrados', text2: 'La aplicación se recargará con datos limpios.' });
            } catch (e) {
              console.error("Error borrando todo el storage:", e);
              Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudieron borrar los datos.' });
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F2',
      },
      headerTitleStyle: {
        color: isDarkMode ? 'white' : 'black',
      },
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Platform.OS === 'ios' ? 10 : 0, gap: 8 }}>
          <Ionicons
            name="sunny"
            size={22}
            color={isDarkMode ? '#8E8E93' : '#FFC300'} // Gris en modo oscuro, amarillo en modo claro
          />
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsDarkMode}
            value={isDarkMode}
          />
          <Ionicons
            name="moon"
            size={22}
            color={isDarkMode ? '#EAEAEA' : '#8E8E93'} // Blanco en modo oscuro, gris en modo claro
          />
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginRight: Platform.OS === 'ios' ? 10 : 15 }}>
          {/* Botón para borrar storage (desarrollo) */}
          <TouchableOpacity onPress={handleClearAllStorage} testID="clear-storage-button">
            <Ionicons name="trash-outline" size={24} color={isDarkMode ? '#FF453A' : '#FF3B30'} />
          </TouchableOpacity>

          {/* Botón Cargar PDF */}
          <TouchableOpacity
            onPress={() => navigation.navigate("RosterPannel", { autoPick: true })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Ionicons name="document-text-outline" size={18} color={isDarkMode ? '#AECBFA' : '#007AFF'} />
            <Text style={{
              color: isDarkMode ? '#AECBFA' : '#007AFF',
              marginLeft: 6,
              fontWeight: '600',
              fontSize: 16,
            }}>Cargar PDF</Text>
          </TouchableOpacity>
        </View>
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

  // Scroll automático al abrir
  useEffect(() => {
    if (sections.length > 0 && !hasScrolledRef.current) {
      setTimeout(() => {
        scrollToToday();
        hasScrolledRef.current = true;
      }, 800); // Un delay generoso para dar tiempo a las mediciones iniciales
    }
  }, [sections, scrollToToday]);

  const containerStyles = [
    styles.container,
    isDarkMode && { backgroundColor: '#1C1C1E' } // Fondo principal más suave
  ];

  return (
    <SafeAreaView style={containerStyles}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.listContainer}>
      {sections.length > 0 ? (
        <>
          <SectionList
            ref={sectionListRef}
            sections={sections}
            keyExtractor={(item) => item.__uid}
            stickySectionHeadersEnabled={false}
            windowSize={11}
            renderItem={({ item, index, section }) => {
              if (!section) return null;
              const isLastOfDay = index === (section.data?.length || 0) - 1;
              return (
                <View onLayout={(e) => handleItemLayout(section.sectionIndex, index, e.nativeEvent.layout.height)}>
                  {item.note && !item.flightNumber ? (
                    <View style={[getActivityStyle(item.activity, isDarkMode), { justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginVertical: 6, borderRadius: 8, padding: 15 }]}>
                      <Text style={{ color: isDarkMode ? '#FFF' : '#333', fontWeight: '500' }}>{item.note}</Text>
                    </View>
                  ) : (
                    <FlightCard isDarkMode={isDarkMode} flight={item} isLastOfDay={isLastOfDay} tv={section.tv} tsv={section.tsv} te={section.te} />
                  )}
                </View>
              );
            }}
            renderSectionHeader={({ section, index }) => {
              if (!section) return null;
              const { title, fullDate, tv, tsv, checkin } = section;
              const te = subtractMinutes(tsv, 30);
              const today = isTodayStrict(fullDate);
              const headerBgStyle = isDarkMode ? (index % 2 === 0 ? { backgroundColor: '#48484A' } : { backgroundColor: '#3A3A3C' }) : (index % 2 === 0 ? styles.sectionHeaderEven : styles.sectionHeaderOdd);
              const todayBgStyle = today ? styles.todaySection : {};
              const mainTextColor = today ? '#000' : (isDarkMode ? '#FFFFFF' : '#1C1C1E');
              const subTextColor = today ? '#333' : (isDarkMode ? '#EAEAEA' : '#555');
              const headerInfoLabelColor = today ? '#333' : (isDarkMode ? '#AEAEB2' : '#555');
              const headerInfoValueColor = today ? '#000' : (isDarkMode ? '#FFFFFF' : '#1C1C1E');
              const borderStyle = isDarkMode ? { borderBottomColor: '#48484A' } : {};
              return (
                <View onLayout={(e) => { handleHeaderLayout(section.sectionIndex, e.nativeEvent.layout.height); }} style={[styles.sectionHeader, headerBgStyle, todayBgStyle, borderStyle, { flexDirection: "row", alignItems: "center" }]}>
                  {/* Fecha a la izquierda */}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sectionHeaderText, { color: mainTextColor }]}>{formatDateShort(title)}</Text>
                    <Text style={{ fontSize: 10, color: subTextColor, marginLeft: 4 }}>
                      {(() => {
                        const d = new Date(fullDate);
                        const mes = d.toLocaleDateString("es-ES", { month: "long" });
                        return mes.charAt(0).toUpperCase() + mes.slice(1);
                      })()}
                    </Text>
                  </View>

                  {/* Report en el medio */}
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    {checkin && (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: headerInfoLabelColor, fontWeight: '600', textTransform: 'uppercase' }}>Report</Text>
                        <Text style={{ fontSize: 14, color: headerInfoValueColor, fontWeight: '700' }}>{checkin}</Text>
                      </View>
                    )}
                  </View>

                  {/* TTEE a la derecha */}
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {te && (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: headerInfoLabelColor, fontWeight: '600', textTransform: 'uppercase' }}>TTEE</Text>
                        <Text 
                          style={[{ fontSize: 14, fontWeight: '700', color: headerInfoValueColor }, getDynamicStyle(te, isDarkMode)]}
                          numberOfLines={1} // Evita que el texto se divida en dos líneas
                          adjustsFontSizeToFit // Reduce el tamaño de la fuente si no entra
                        >{te}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
          />
          <TodayButton onPress={scrollToToday} />
        </>
      ) : (
        <EmptyRoster navigation={navigation} isDarkMode={isDarkMode} />
      )}
      </View>
    </SafeAreaView>
  );
}