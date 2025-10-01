import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ActivityIndicator, Platform, StyleSheet, View, AppState as RNAppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { useSubscription } from "./hooks/useSubscription";
import RosterPannelScreen from "./Screens/RosterPannel";
import RosterScreen from "./Screens/RosterScreen";
import Calendar from "./Screens/Calendar";
import CalculatorScreen from "./Screens/Calculator";
import FlexScreen from "./Screens/Flex";
import ViaticosScreen from "./Screens/Viaticos";
import SubscriptionPage from "./Screens/SubscriptionPage"; 
import DisclaimerModal from "./Components/DisclaimerModal"; 
import DebugBanner from "./Components/DebugBanner"; 
import WelcomeScreen from "./Components/WelcomeScreen"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Flag de Desarrollo ---
// MODO DE PRUEBA
const ALWAYS_SHOW_DISCLAIMER = false; // Poner en 'false' para el comportamiento normal
const ALWAYS_SHOW_WELCOME = true; // Poner en 'false' para el comportamiento normal

// --- Configuración global de idioma para los calendarios ---
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';
// ---------------------------------------------------------

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function RosterStack({ isSubscribed, offerings, isDarkMode, setIsDarkMode }) {
  return (
    <Stack.Navigator initialRouteName="RosterScreen">
      <Stack.Screen
        name="RosterScreen">
        {(props) => (
          <RosterScreen
            {...props}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isSubscribed={isSubscribed}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="RosterPannel" options={{ title: "Roster" }}>
        {(props) => (
          <RosterPannelScreen
            {...props}
            isSubscribed={isSubscribed}
            offerings={offerings}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function CalendarStack({ isDarkMode, setIsDarkMode }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarScreen"
      >
        {(props) => (
          <Calendar
            {...props}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function ViaticosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ViaticosScreen"
        component={ViaticosScreen}
        // Las opciones del header (botones, título) se configuran dinámicamente
        // dentro del componente ViaticosScreen, por lo que no se necesita nada aquí.
      />
    </Stack.Navigator>
  );
}

function FlexStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FlexScreen"
        component={FlexScreen}
        // Las opciones del header se configuran dentro de FlexScreen
      />
    </Stack.Navigator>
  );
}

function MainTabs({ isDarkMode, setIsDarkMode, isSubscribed, offerings }) {
  return (
    <Tab.Navigator
      tabBarPosition="bottom" // Mueve la barra de pestañas a la parte inferior
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: isDarkMode ? "#AECBFA" : "#3983f1",
        tabBarInactiveTintColor: isDarkMode ? "#8E8E93" : "#888",
        tabBarShowIcon: true,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#121212',
          paddingBottom: Platform.OS === 'android' ? 32 : 0, // Aumentamos más el espacio para evitar superposición
          borderTopColor: isDarkMode ? '#272729' : '#E0E0E0',
        },
        // Estilos para el contenedor de cada pestaña para centrar el contenido
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          textTransform: 'capitalize', // Evita que los nombres queden en mayúsculas
          margin: 0, // Elimina márgenes que puedan causar desalineación
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#3983f1', // La línea que indica la pestaña activa
          height: 2,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Roster") {
            iconName = "airplane-outline";
          } else if (route.name === "Calendario") {
            iconName = "calendar-outline";
          } else if (route.name === "Calculador") {
            iconName = "calculator-outline";
          } else if (route.name === "Viaticos") {
            iconName = "wallet-outline";
          } else if (route.name === "Flex") {
            iconName = "time-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Roster">
        {(props) => (
          <RosterStack
            {...props}
            isSubscribed={isSubscribed}
            offerings={offerings}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Calendario">
        {(props) => <CalendarStack {...props} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
      </Tab.Screen>
      <Tab.Screen name="Calculador" component={CalculatorScreen} />
      <Tab.Screen name="Viaticos" component={ViaticosStack} />
      <Tab.Screen name="Flex" component={FlexStack} />

    </Tab.Navigator>
  );
}

export default function App() {
  const { isSubscribed, offerings, loading, purchasePackage, restorePurchases, showDebugBanner, activeSubscription, appUserID } = useSubscription();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const [appState, setAppState] = useState('loading'); // 'loading', 'welcome', 'ready'
  const navigationRef = React.useRef(null);

  useEffect(() => {
    const prepareApp = async () => {
      // Si el flag de desarrollo está activo, siempre mostramos la bienvenida.
      if (ALWAYS_SHOW_WELCOME) {
        setAppState('welcome');
        return;
      }

      try {
        const hasOpenedBefore = await AsyncStorage.getItem('has_opened_before');
        if (!hasOpenedBefore) {
          setAppState('welcome');
        } else {
          setAppState('ready');
        }
      } catch (e) {
        console.warn('Error checking first open', e);
        setAppState('ready'); // En caso de error, continuar a la app
      }
    };

    prepareApp();
  }, []);

  // El disclaimer se verifica solo cuando la app está lista (después de la bienvenida)
  useEffect(() => {
    if (appState !== 'ready') return;

    const checkDisclaimer = async () => {
      // Si el flag de desarrollo está activo, siempre mostramos el modal y salimos.
      if (ALWAYS_SHOW_DISCLAIMER) {
        setTimeout(() => setIsDisclaimerVisible(true), 500);
        return;
      }

      try {
        const hasAccepted = await AsyncStorage.getItem('disclaimer_accepted');
        if (hasAccepted !== 'true') {
          // Si no ha sido aceptado, mostrar el modal después de un breve instante
          // para asegurar que la UI principal esté lista.
          setTimeout(() => {
            setIsDisclaimerVisible(true);
          }, 500);
        }
      } catch (e) {
        console.error("Fallo al leer la preferencia del disclaimer.", e);
        // En caso de error, es más seguro mostrar el disclaimer.
        setIsDisclaimerVisible(true);
      }
    };

    checkDisclaimer();
  }, [appState]);

  const handleWelcomeFinish = useCallback(async () => {
    try {
      await AsyncStorage.setItem('has_opened_before', 'true');
    } catch (e) {
      console.warn('Failed to save first open flag', e);
    }
    setAppState('ready');
  }, []);

  // --- Manejo de Archivos Compartidos ---
  const handleSharedFile = useCallback(async (url) => {
    if (!url) return;

    console.log("Archivo compartido detectado:", url);
    Toast.show({ type: 'info', text1: 'Procesando PDF', text2: 'Abriendo archivo compartido...' });

    if (!navigationRef.current) {
      console.warn("La navegación no está lista para manejar el archivo compartido.");
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(url);
      if (!fileInfo.exists) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'El archivo compartido no existe.' });
        return;
      }

      // --- LÓGICA DE SUSCRIPCIÓN (Igual que en RosterScreen y Calendar) ---
      if (isSubscribed) {
        // Si está suscrito, procesa el archivo.
        navigationRef.current.navigate('RosterPannel', { sharedFileUri: url });
      } else {
        // Si no está suscrito, lo envía a la página de planes.
        navigationRef.current.navigate('SubscriptionPage');
      }
    } catch (error) {
      console.error("Error al manejar archivo compartido:", error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo abrir el archivo.' });
    }
  }, [isSubscribed]); // Añadimos isSubscribed como dependencia

  useEffect(() => {
    // Maneja el caso en que la app se abre desde cero con un archivo compartido
    Linking.getInitialURL().then(url => {
      if (url) handleSharedFile(url);
    });

    // Maneja el caso en que un archivo se comparte mientras la app ya está abierta
    const subscription = Linking.addEventListener('url', (event) => {
      handleSharedFile(event.url);
    });

    return () => subscription.remove();
  }, [handleSharedFile]);

  if (appState === 'welcome') {
    return <WelcomeScreen onFinish={handleWelcomeFinish} />;
  }

  // Muestra el loader mientras se prepara la app o se cargan las suscripciones
  if (appState === 'loading' || loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    // Envolvemos todo en un View para que Toast sea el último elemento y se superponga.
    <View style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
        {/* El banner de depuración se renderiza aquí, por encima de todo */}
        <DebugBanner
          show={showDebugBanner}
          isSubscribed={isSubscribed}
          offerings={offerings}
          activeSubscription={activeSubscription}
          appUserID={appUserID}
        />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {(props) => (
                <MainTabs
                  {...props}
                  isSubscribed={isSubscribed}
                  offerings={offerings}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="SubscriptionPage"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: "Planes de Suscripción",
              }}
            >
              {(props) => (
                <SubscriptionPage
                  {...props}
                  offerings={offerings}
                  purchasePackage={purchasePackage}
                  restorePurchases={restorePurchases}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>

        {/* El modal del disclaimer se renderiza aquí, por encima de todo */}
        <DisclaimerModal
          visible={isDisclaimerVisible}
          onClose={() => setIsDisclaimerVisible(false)}
        />
      </SafeAreaView>
      {/* El Toast se renderiza al final para asegurar que se muestre sobre todos los elementos */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeAreaDark: {
    backgroundColor: '#121212',
  },
});