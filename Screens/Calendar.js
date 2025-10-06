import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Switch, Platform, StatusBar, Keyboard, Animated, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../Styles/CalendarScreenStyles";
import { useSubscription } from "../hooks/useSubscription";
import EmptyRoster from "../Components/EmptyRoster";
import CalendarInfo from "../Components/CalendarInfo";
import SettingsModal from "../Components/SettingsModal";
import ToDoList from "../Components/ToDoList/ToDoList.js";
import { Ionicons } from "@expo/vector-icons";
import { getToday, isTodayWithOffset } from "../Helpers/dateManager";
import { subtractMinutes } from "../Helpers/time";
import * as ExpoCalendar from 'expo-calendar';
import moment from "moment";

const COLORS = {
  libre: { bg: "rgba(0, 255, 0, 0.15)", border: "#3cff00ff" },
  trabajo: { bg: "rgba(204, 194, 57, 0.15)", border: "#c7b834ff" },
  gua: { bg: "rgba(255,59,48,0.15)", border: "#FF3B30" },
  esm: { bg: "rgba(255,149,0,0.15)", border: "#FF9500" },
};

// Iconos y símbolos para cada tipo de actividad
const ACTIVITY_SYMBOLS = {
  vuelo: "🛫",
  gua: "🟠",
  esm: "📚",
  tof: "☀️",
  "*": "☀️",
  "d/l": "☀️",
  vac: "🏖️",
  med: "🚑",
  off: "☀️",
  rest: "☀️",
  htl: "🏨",
  vop: "⛱️",
  eld: "💻"
};


const getDayType = (day) => {
  if (!day || !day.flights || day.flights.length === 0) return "libre";
  const firstActivity = day.flights[0];

  if (firstActivity.type === "OP" || (firstActivity.flightNumber && /^AR\d+/.test(firstActivity.flightNumber))) {
    return "vuelo";
  }
  if (["*", "D/L", "VAC", "MED", "OFF", "REST"].includes(firstActivity.type)) {
    return "libre";
  }
  // Para GUA, ESM, TOF, etc., devuelve el tipo mismo
  return firstActivity.type;
};

// Render timeline de vuelos/guardias
const renderTimeline = (dayData, isDarkMode) => {
  // No mostrar timeline si no hay datos o es un día libre
  // Tampoco mostrar si es un vuelo nocturno que solo tiene llegada (sin checkin)
  if (!dayData || getDayType(dayData) === 'libre' || (getDayType(dayData) === 'vuelo' && !dayData.checkin)) {
    return null;
  }
  const type = getDayType(dayData);
  let depFirst, end;

  switch (type) {
    case "libre":
      depFirst = "00:00";
      end = "00:00";
      break;
    case "vuelo": {
      const lastFlight = dayData.flights[dayData.flights.length - 1];
      end = lastFlight?.checkout || lastFlight?.arrTime;
      depFirst = dayData.checkin || (dayData.flights.length > 0 ? "00:00" : null);
      break;
    }
    case "GUA":
      depFirst = "00:00";
      end = "23:59";
      break;
    case "ESM": {
      const raw = dayData.flights[0]?.raw;
      const times = raw?.match(/\d{1,2}:\d{2}/g);
      if (times && times.length >= 2) {
        depFirst = times[0];
        end = times[times.length - 1];
      } else {
        depFirst = "00:00";
        end = "23:59";
      }
      break;
    }
    default:
      return null; // No mostrar timeline para otras actividades especiales
  }

  if (!depFirst || !end) {
    return null;
  }

  const [startH, startM] = depFirst.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startHour = startH + startM / 60;
  const endHour = endH + endM / 60;
  const isOvernight = endHour < startHour;

  const blocks = Array.from({ length: 24 }, (_, h) => {
    let active = false;
    if (isOvernight && dayData.checkin) {
      active = h >= Math.floor(startHour);
    } else {
      // If the end time is exactly on the hour (e.g., 18:00), the block for that hour should be included.
      // The original logic `h < Math.ceil(endHour)` fails because Math.ceil(18) is 18, making the condition `18 < 18` false.
      // Using `h <= Math.floor(endHour)` correctly includes the end hour block.
      active = h >= Math.floor(startHour) && h <= Math.floor(endHour);
    }

    // Default content for a standard hour block
    let content = <Text style={[styles.hourLabel, isDarkMode && styles.hourLabelDark, active && { color: '#fff' }]}>{h.toString().padStart(2, "0")}</Text>;

    // Special content for check-in and end times
    if (h === startH && h === endH && depFirst !== end) {
      // Case: Check-in and Fin in the same hour block
      content = (
        <>
          <Text style={[styles.timelineBlockLabel, active && { color: '#fff' }]}>Inicio / Fin</Text>
          <Text style={[styles.timelineBlockLabel, isDarkMode && styles.timelineBlockLabelDark, active && { color: '#fff' }]}>Inicio / Fin</Text>
          <Text 
            style={[styles.hourLabelSpecial, active && { color: '#fff' }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {`${depFirst}-${end}`}
          </Text>
        </>
      );
    } else if (h === startH) {
      // Case: Check-in
      content = (
        <>
          <Text style={[styles.timelineBlockLabel, isDarkMode && styles.timelineBlockLabelDark, active && { color: '#fff' }]}>Inicio</Text>
          <Text 
            style={[styles.hourLabelSpecial, active && { color: '#fff' }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >{depFirst}</Text>
        </>
      );
    } else if (h === endH) {
      // Case: Fin
      content = (
        <>
          <Text style={[styles.timelineBlockLabel, isDarkMode && styles.timelineBlockLabelDark, active && { color: '#fff' }]}>Fin</Text>
          <Text 
            style={[styles.hourLabelSpecial, active && { color: '#fff' }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >{end}</Text>
        </>
      );
    }

    return (
      <View key={h} style={[styles.hourBlock, active ? [styles.activeBlock, isDarkMode && styles.activeBlockDark] : [styles.inactiveBlock, isDarkMode && styles.inactiveBlockDark]]}>
        {content}
      </View>
    );
  });

  const row1 = blocks.slice(0, 8);
  const row2 = blocks.slice(8, 16);
  const row3 = blocks.slice(16, 24);

  return (
    <View style={[styles.timelineContainer, isDarkMode && styles.timelineContainerDark]}>
      <View style={styles.timeline}>
        <View style={styles.timelineRow}>{row1}</View>
        <View style={styles.timelineRow}>{row2}</View>
        <View style={styles.timelineRow}>{row3}</View>
      </View>
    </View>
  );
};

// Función separada para renderizar los horarios
const renderTimeInfo = (day, isDarkMode) => {
  if (!day) return null;

  const type = getDayType(day);
  if (type === "libre") return null;

  const checkin = day.checkin;
  const lastFlight = day.flights?.[day.flights.length - 1];
  const checkout = lastFlight?.checkout || lastFlight?.arrTime;

  if (!checkin && !checkout) return null;

  return (
    <View style={styles.timeInfoHorizontal}>
      {checkin && (
        <View style={styles.timeColumn}>
          <Text style={[styles.timeValue, isDarkMode && styles.timeValueDark]}>{checkin}</Text>
          <Text style={[styles.timeLabel, isDarkMode && styles.timeLabelDark]}>inicio</Text>
        </View>
      )}
      {checkin && checkout && (<Text style={styles.timeSeparator}>|</Text>)}
      {checkout && (
        <View style={styles.timeColumn}>
          <Text style={[styles.timeValue, isDarkMode && styles.timeValueDark]}>{checkout}</Text>
          <Text style={[styles.timeLabel, isDarkMode && styles.timeLabelDark]}>fin</Text>
        </View>
      )}
    </View>
  );
};

// Función para renderizar TSV y TTEE
const renderServiceTimes = (day, isDarkMode) => {
  if (!day || getDayType(day) !== 'vuelo') return null;

  const tsv = day.tsv;
  const ttee = tsv ? subtractMinutes(tsv, 30) : null;

  if (!tsv && !ttee) return null;

  // Lógica para el color del TTEE
  let tteeStyle = {};
  if (ttee) {
    const [hours, minutes] = ttee.split(':').map(Number);
    if (hours > 8 || (hours === 8 && minutes > 0)) {
      tteeStyle = { color: '#28a745' }; // Verde para TTEE > 8hs
    }
  }

  return (
    <View style={[styles.serviceTimesContainer, isDarkMode && styles.serviceTimesContainerDark]}>
      {tsv && (
        <View style={styles.timeColumn}>
          <Text style={[styles.timeValue, isDarkMode && styles.timeValueDark]}>{tsv}</Text>
          <Text style={[styles.timeLabel, isDarkMode && styles.timeLabelDark]}>TSV</Text>
        </View>
      )}
      {ttee && (
        <View style={styles.timeColumn}>
          <Text style={[styles.timeValue, isDarkMode && styles.timeValueDark, tteeStyle]}>{ttee}</Text>
          <Text style={[styles.timeLabel, isDarkMode && styles.timeLabelDark]}>TTEE</Text>
        </View>
      )}
    </View>
  );
};

// Función para calcular la duración de un vuelo
const calculateDuration = (depTime, arrTime) => {
  if (!depTime || !arrTime || !moment(depTime, 'HH:mm', true).isValid() || !moment(arrTime, 'HH:mm', true).isValid()) {
    return null;
  }

  const start = moment(depTime, 'HH:mm');
  const end = moment(arrTime, 'HH:mm');

  if (end.isBefore(start)) {
    end.add(1, 'day');
  }

  const duration = moment.duration(end.diff(start));
  return `${String(Math.floor(duration.asHours())).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}hs`;
};

export default function CalendarScreen({ navigation, isDarkMode, setIsDarkMode }) {
  const [roster, setRoster] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const { isSubscribed } = useSubscription();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  // Función para abrir el modal de info desde el de configuración
  const handleOpenInfo = () => {
    setIsSettingsModalVisible(false); // Primero cerramos el modal de ajustes
    setTimeout(() => {
      setIsInfoModalVisible(true); // Luego abrimos el de información
    }, 300); // Un pequeño delay para una transición más suave
  };

  // --- Estado para la vista previa flotante ---
  const [previewTaskText, setPreviewTaskText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [bubbleOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        Animated.timing(bubbleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setPreviewTaskText(''); // Limpiar vista previa al ocultar teclado
        Animated.timing(bubbleOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [bubbleOpacity]);

  // Configurar el header dinámicamente
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F2'
      },
      headerTitle: () => (
        <Text
          style={{ color: isDarkMode ? 'white' : 'black', fontWeight: '700', fontSize: 22 }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Tu Calendario
        </Text>
      ),
      headerTitleAlign: 'left',
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginRight: 15 }}>
          <TouchableOpacity onPress={handleDeleteCalendarEvents} testID="delete-calendar-button">
            <Ionicons name="trash-bin-outline" size={24} color={isDarkMode ? '#FF453A' : '#FF3B30'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportToCalendar}>
            <Ionicons name="share-outline" size={24} color={isDarkMode ? '#AECBFA' : '#007AFF'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MapScreen', { roster: roster })}>
            <Ionicons name="map-outline" size={24} color={isDarkMode ? '#AECBFA' : '#007AFF'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSettingsModalVisible(true)}>
            <Ionicons name="cog-outline" size={24} color={isDarkMode ? '#AECBFA' : '#007AFF'} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isDarkMode, roster]); // Dependemos de roster para que la función de exportar lo tenga actualizado

  // --- Lógica para Exportar a Calendario con Expo ---
  const handleExportToCalendar = async () => {
    if (!roster || roster.length === 0) {
      Alert.alert("Sin datos", "No hay actividades en el roster para exportar.");
      return;
    }

    // 1. Pedir permiso para acceder al calendario
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "No se puede continuar sin acceso al calendario.");
      return;
    }

    // 2. Obtener el calendario por defecto (necesario para Android)
    async function getDefaultCalendarId() {
      if (Platform.OS === 'ios') {
        const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
        return defaultCalendar.id;
      }
      // En Android, buscamos uno que sea escribible
      const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
      const writableCalendars = calendars.filter(cal => cal.allowsModifications);
      if (writableCalendars.length > 0) {
        return writableCalendars[0].id; // Usamos el primero que encontramos
      }
      return null;
    }

    const calendarId = await getDefaultCalendarId();
    if (!calendarId) {
      Alert.alert("Error", "No se encontró un calendario válido en tu dispositivo para guardar los eventos.");
      return;
    }

    // 3. Confirmar con el usuario antes de agregar los eventos
    Alert.alert(
      "Exportar Calendario",
      `Se encontraron ${roster.length} días con actividad. ¿Deseas agregarlos a tu calendario? Esto puede tardar unos segundos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reemplazar",
          onPress: async () => {
            // --- NUEVO: Primero, borramos los eventos antiguos ---
            try {
              const oldEventIdsJson = await AsyncStorage.getItem('roster_calendar_event_ids');
              const oldEventIds = oldEventIdsJson ? JSON.parse(oldEventIdsJson) : [];
              if (oldEventIds.length > 0) {
                console.log(`Borrando ${oldEventIds.length} eventos antiguos...`);
                for (const id of oldEventIds) {
                  try { await ExpoCalendar.deleteEventAsync(id); } catch (e) { /* El evento ya no existía, no hay problema */ }
                }
              }
            } catch (error) {
              console.error("Error borrando eventos antiguos:", error);
            }
            // --- FIN DEL NUEVO BLOQUE ---

            let eventsAdded = 0;
            console.log("--- INICIANDO EXPORTACIÓN A CALENDARIO ---");
            const newEventIds = []; // Array para guardar los IDs de los nuevos eventos

            for (const day of roster) {
              const type = getDayType(day);
              if (type === 'libre' || !day.fullDate) continue;

              const symbol = ACTIVITY_SYMBOLS[type] || ACTIVITY_SYMBOLS[day.flights?.[0]?.type?.toLowerCase()] || "📋";
              const startDate = moment.utc(day.fullDate);
              let endDate = moment.utc(day.fullDate);
              let title = `${symbol} ${type.toUpperCase()}`; // Título por defecto más limpio
              let notes = `Actividad registrada desde RosterApp.\n\nTipo: ${type.toUpperCase()}`;

              if (day.checkin) {
                const [h, m] = day.checkin.split(':');
                startDate.hour(h).minute(m);
                endDate.hour(h).minute(m).add(1, 'hour'); // Duración por defecto de 1 hora
              }

              // --- Lógica mejorada para VUELOS ---
              if (type === 'vuelo' && day.flights.length > 0) {
                const lastFlight = day.flights[day.flights.length - 1];
                const checkout = lastFlight?.checkout || lastFlight?.arrTime;

                // Título: "Vuelo AEP - USH - EZE"
                const route = [day.flights[0].origin, ...day.flights.map(f => f.destination)].join(' - ');
                title = `${symbol} Vuelo: ${route}`;

                // --- Construcción de las notas con el nuevo formato ---
                let newNotes = [];

                // 1. Línea de Inicio y Fin
                if (day.checkin && checkout) {
                  newNotes.push(`Inicio ${day.checkin} | Fin ${checkout}`);
                }

                // 2. Línea de TSV y TTEE
                const ttee = day.tsv ? subtractMinutes(day.tsv, 30) : null;
                if (day.tsv && ttee) {
                  newNotes.push(`TSV: ${day.tsv} | TTEE: ${ttee}`);
                }

                // 3. Detalle de cada tramo
                const flightDetails = day.flights.map(f => {
                  const duration = calculateDuration(f.depTime, f.arrTime);
                  return `${f.flightNumber} ${f.origin} (${f.depTime}) - ${f.destination} (${f.arrTime}) | ${duration || ''}`;
                }).join('\n');

                notes = `${newNotes.join('\n')}\n\n${flightDetails}`;

                if (checkout) {
                  const [h, m] = checkout.split(':');
                  endDate.hour(h).minute(m);
                  if (endDate.isBefore(startDate)) endDate.add(1, 'day');
                }
              } else if (type !== 'libre') {
                // --- Lógica para OTRAS ACTIVIDADES (GUA, ESM, etc.) ---
                const activity = day.flights[0];
                title = `${symbol} ${activity.type}`; // Título como "📚 ESM" o "🟠 GUA"

                // Si la actividad tiene horarios, los agregamos a las notas
                if (activity.depTime && activity.arrTime) {
                  notes += `\nHorario: ${activity.depTime} - ${activity.arrTime}`;
                  const [h, m] = activity.arrTime.split(':');
                  endDate.hour(h).minute(m);
                }
              }

              try {
                console.log(`📄 Creando evento: Título="${title}", Inicio="${startDate.toISOString()}", Fin="${endDate.toISOString()}"`);
                const eventId = await ExpoCalendar.createEventAsync(calendarId, { title, startDate: startDate.toDate(), endDate: endDate.toDate(), notes, timeZone: 'UTC' });
                newEventIds.push(eventId); // Guardamos el ID del evento creado
                eventsAdded++;
              } catch (error) { console.error(`Error al crear evento para ${day.fullDate}:`, error); }
            }

            // Guardar los nuevos IDs en AsyncStorage, añadiéndolos a los existentes
            try {
              // Ahora solo guardamos los IDs de la última exportación
              await AsyncStorage.setItem('roster_calendar_event_ids', JSON.stringify(newEventIds));
            } catch (error) {
              console.error("Error guardando IDs de eventos:", error);
            }

            console.log(`--- EXPORTACIÓN FINALIZADA: ${eventsAdded} eventos agregados. ---`);
            Alert.alert("Finalizado", `Se han agregado ${eventsAdded} eventos a tu calendario.`);
          },
        },
      ]
    );
  };

  // --- Lógica para BORRAR eventos del Calendario ---
  const handleDeleteCalendarEvents = async () => {
    Alert.alert(
      "Borrar Eventos del Calendario",
      "¿Estás seguro de que quieres eliminar todos los eventos que se exportaron desde RosterApp? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert("Permiso denegado", "Se necesita acceso al calendario para borrar eventos.");
              return;
            }

            try {
              const eventIdsJson = await AsyncStorage.getItem('roster_calendar_event_ids');
              const eventIds = eventIdsJson ? JSON.parse(eventIdsJson) : [];

              if (eventIds.length === 0) {
                Alert.alert("Sin eventos", "No se encontraron eventos para borrar.");
                return;
              }

              console.log(`--- INICIANDO BORRADO DE ${eventIds.length} EVENTOS ---`);
              for (const id of eventIds) {
                try { await ExpoCalendar.deleteEventAsync(id); console.log(`🗑️ Evento borrado: ${id}`); } catch (e) { console.log(`⚠️ Evento ${id} no encontrado, probablemente ya fue borrado.`); }
              }

              await AsyncStorage.removeItem('roster_calendar_event_ids');
              Alert.alert("Finalizado", `Se han eliminado ${eventIds.length} eventos del calendario.`);
              console.log("--- BORRADO FINALIZADO ---");
            } catch (error) { console.error("Error al borrar eventos:", error); Alert.alert("Error", "No se pudieron borrar los eventos."); }
          },
        },
      ]
    );
  };

  // Temas para el componente Calendar
  const lightTheme = {
    calendarBackground: '#f9f9f9',
    monthTextColor: '#333',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    todayTextColor: "#FF3B30", // Rojo para el día de hoy
    arrowColor: "#673ab7",
    textSectionTitleColor: "#555",
    dotColor: 'black', // Punto negro para tareas en modo claro
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayFontSize: 14,
    textMonthFontSize: 18,
    textSectionTitleFontSize: 12,
  };

  const darkTheme = {
    calendarBackground: '#1C1C1E',
    monthTextColor: '#e0e0e0',
    dayTextColor: '#e0e0e0',
    textDisabledColor: '#444',
    todayTextColor: '#FF453A', // Rojo más brillante para el día de hoy en modo oscuro
    arrowColor: '#AECBFA',
    textSectionTitleColor: '#8E8E93',
    dotColor: 'white', // Punto blanco para tareas en modo oscuro
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayFontSize: 14,
    textMonthFontSize: 18,
    textSectionTitleFontSize: 12,
  };

  // Cargar roster desde AsyncStorage
  const loadRoster = async () => {
    try {
      const saved = await AsyncStorage.getItem("roster");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRoster(parsed);
      }
    } catch (err) {
      console.log("❌ Error cargando roster:", err);
    }
  };

  // Cargar tareas desde AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (err) {
      console.log("❌ Error cargando tasks:", err);
    }
  };

  useEffect(() => { loadRoster(); loadTasks(); }, []);
  useFocusEffect(useCallback(() => { loadRoster(); loadTasks(); }, []));
  
  // Re-genera las marcas del calendario si el roster o el tema cambian.
  useEffect(() => {
    if (roster.length > 0) {
      generateMarks(roster, tasks, isDarkMode);
    }
  }, [roster, tasks, isDarkMode]);
  
  // Seleccionar día actual
  useEffect(() => {
    const today = getToday().toISOString().split("T")[0];
    const found = roster.find((d) => d.fullDate?.startsWith(today));
    setSelectedDay(found || null);
  }, [roster]);

  // Marcar días en calendario
  const generateMarks = (data, currentTasks, darkMode) => {
    const marks = {};
    data.forEach((day) => {
      const date = day.fullDate?.split("T")[0];
      if (!date) return;

      let estado = "libre";
      let dotColor = COLORS.libre.border; // Color por defecto para el punto

      // Definimos los colores de los puntos según la actividad
      const dotColors = { trabajo: COLORS.trabajo.border, gua: COLORS.gua.border, esm: COLORS.esm.border, libre: COLORS.libre.border };

      const isTodayDate = isTodayWithOffset(new Date(day.fullDate));

      if (day.flights?.some(f => f.type === "GUA")) estado = "gua";
      else if (day.flights?.some(f => f.type === "ESM")) estado = "esm";
      else if (day.flights?.some(f => f.type === "OP" || f.type.startsWith("AR") || f.type === "HTL")) estado = "trabajo";

      marks[date] = {
        // Añadimos la configuración de los puntos (dots)
        dots: [{ key: estado, color: dotColors[estado] || COLORS.libre.border }],
        customStyles: {
          container: {
            backgroundColor: COLORS[estado].bg,
            borderColor: COLORS[estado].border,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          text: {
            // Si es hoy, aplica el color rojo del tema, si no, el color normal.
            color: isTodayDate ? (darkMode ? darkTheme.todayTextColor : lightTheme.todayTextColor) : (darkMode ? '#e0e0e0' : '#222'),
            fontWeight: "600"
          },
        },
      };

      // Añadir un punto si el día tiene tareas
      const dateTasks = currentTasks && currentTasks[date];
      if (dateTasks && dateTasks.length > 0) {
        marks[date].marked = true;
      }
    });
    setMarkedDates(marks);
  };

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    const foundDay = roster.find((d) => d.fullDate?.startsWith(dateString));
    // Si no se encuentra, creamos un objeto de día vacío para que el usuario pueda añadir tareas
    setSelectedDay(foundDay || { fullDate: dateString + "T00:00:00.000Z", flights: [], note: "Día sin actividad" });
  };

  const handleUploadPress = () => {
    if (isSubscribed) {
      navigation.navigate("RosterPannel", { autoPick: true });
    } else {
      navigation.navigate("SubscriptionPage");
    }
  };

  // Función simplificada solo para el título
  const formatDayTitleSimple = (day) => {
    if (!day) return "";

    const dayName = new Date(day.fullDate).toLocaleDateString("es-ES", { 
      day: "2-digit", 
      weekday: "long" 
    }).replace(/^\w/, c => c.toUpperCase());

    const type = getDayType(day);    
    const symbol = ACTIVITY_SYMBOLS[type] || ACTIVITY_SYMBOLS[day.flights?.[0]?.type?.toLowerCase()] || "📋";
    let activityText;

    if (type === "libre") {
      activityText = "Libre";
    } else if (type === "vuelo") {
      // Para vuelos, mostramos la ruta completa en el título
      const route = [day.flights[0].origin, ...day.flights.map(f => f.destination)].join(' - ');
      activityText = ` ${route}`;
    } else {
      // Para otras actividades, mostramos el tipo
      activityText = day.flights?.[0]?.type || type.toUpperCase();
    }

    return `${symbol} ${dayName} | ${activityText}`;
  };

  const selectedDateString = selectedDay?.fullDate?.split("T")[0]; 
  const isTodaySelected = selectedDateString === getToday().toISOString().split("T")[0];

  const legendItems = [
    { label: 'Vuelo / Actividad', color: COLORS.trabajo.border },
    { label: 'Guardia', color: COLORS.gua.border },
    { label: 'Simulador / Curso', color: COLORS.esm.border },
    { label: 'Libre / Descanso', color: COLORS.libre.border },
  ];

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {roster.length > 0 ? (
        <>
          <Calendar
            key={isDarkMode ? 'dark-theme' : 'light-theme'} // Forzar re-renderizado al cambiar de tema
            initialDate={getToday().toISOString().split("T")[0]}
            markedDates={{
              ...markedDates,
              [selectedDateString]: {
                ...markedDates[selectedDateString], // Mantener propiedades existentes (como el punto de 'marked')
                customStyles: {
                  container: {
                    backgroundColor: markedDates[selectedDateString]?.customStyles?.container?.backgroundColor || "transparent",
                    borderWidth: 2.5,
                    borderColor: "rgba(128, 0, 128, 0.9)", // Un borde púrpura más intenso
                    borderRadius: 8,
                    // Efecto "lupa"
                    transform: [{ scale: 1.15 }],
                    elevation: 10, // Sombra para Android
                    shadowColor: '#000', // Sombra para iOS
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    zIndex: 10, // Asegura que esté por encima de otros días
                  },
                  text: {
                    // Si es hoy, usa el color rojo del tema, si no, un color de alto contraste.
                    color: isTodaySelected 
                      ? (isDarkMode ? darkTheme.todayTextColor : lightTheme.todayTextColor) 
                      : (isDarkMode ? '#FFF' : '#000'),
                    fontWeight: "bold",
                    fontSize: 15, // Fuente ligeramente más grande
                  },
                },
              },
            }}
            markingType="custom"
            onDayPress={handleDayPress}
            theme={isDarkMode ? darkTheme : lightTheme}
          />

          <ScrollView style={[styles.infoBox, isDarkMode && styles.infoBoxDark]}>
            {selectedDay ? (
              <>
                {/* --- INICIO: Bloque de información del día modificado --- */}
                <View style={[styles.dayHeaderContainer, isDarkMode && styles.dayHeaderContainerDark]}>
                  <Text style={[styles.dayTitle, isDarkMode && styles.dayTitleDark]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                    {formatDayTitleSimple(selectedDay)}
                  </Text>
                  <View style={styles.dayTimesContainer}>
                    {renderTimeInfo(selectedDay, isDarkMode)}
                    {renderServiceTimes(selectedDay, isDarkMode)}
                  </View>
                </View>
                {/* --- FIN: Bloque de información del día modificado --- */}

                {selectedDay.flights?.length > 0 ? (
                  selectedDay.flights.map((f, i) => {
                    const duration = calculateDuration(f.depTime, f.arrTime);
                    // No mostrar nada si es un vuelo de solo llegada (parte de un nocturno)
                    if (!f.flightNumber && !f.origin && f.destination) return null;

                    return (
                      <View key={i} style={[styles.flightDetailsContainer, isDarkMode && styles.flightDetailsContainerDark]}>
                        <Text style={[styles.flightDetailsText, isDarkMode && styles.flightDetailsTextDark]}>
                          {/* Formato mejorado: Vuelo: AEP (13:00) - USH (16:40) */}
                          {f.flightNumber}: {f.origin} ({f.depTime}) - {f.destination} ({f.arrTime})
                        </Text>
                        {duration && <Text style={[styles.flightDuration, isDarkMode && styles.flightDurationDark]}>{duration}</Text>}
                      </View>
                    );
                  })
                ) : (
                  <Text style={[styles.empty, isDarkMode && styles.emptyDark]}>Sin vuelos ni actividad</Text>
                )}

                {renderTimeline(selectedDay, isDarkMode)}

                <ToDoList 
                  selectedDay={selectedDay} 
                  tasks={tasks} 
                  setTasks={setTasks} 
                  isDarkMode={isDarkMode}
                  onNewTaskChange={setPreviewTaskText} // Pasar el setter para la vista previa
                />
              </>
            ) : (
              <Text style={[styles.empty, isDarkMode && styles.emptyDark]}>Seleccioná un día</Text>
            )}
          </ScrollView>
        </>
      ) : (
        <EmptyRoster navigation={navigation} isDarkMode={isDarkMode} onUploadPress={handleUploadPress} />
      )}

      {/* Globo de Vista Previa Flotante */}
      {keyboardHeight > 0 && previewTaskText.trim().length > 0 && (
        <Animated.View style={[ styles.floatingPreviewContainer, { bottom: keyboardHeight + 10, opacity: bubbleOpacity } ]}>
          <View style={[styles.floatingPreviewBubble, isDarkMode && styles.floatingPreviewBubbleDark]}>
            <Text style={[styles.floatingPreviewText, isDarkMode && styles.floatingPreviewTextDark]}>
              {previewTaskText}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Modal de Información */}
      <CalendarInfo
        visible={isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
        isDarkMode={isDarkMode}
        legendItems={legendItems}
      />

      <SettingsModal
        visible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenInfo={handleOpenInfo} // Pasamos la nueva función
      />
    </View>
  );
}