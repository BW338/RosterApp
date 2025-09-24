import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useSubscription } from "./hooks/useSubscription";
import RosterPannelScreen from "./Screens/RosterPannel";
import RosterScreen from "./Screens/RosterScreen";
import Calendar from "./Screens/Calendar";
import CalculatorScreen from "./Screens/Calculator";
import FlexScreen from "./Screens/Flex";
import ViaticosScreen from "./Screens/Viaticos";
import SubscriptionPage from "./Screens/SubscriptionPage"; // Nueva importación
import DisclaimerModal from "./Components/DisclaimerModal"; // Importar el nuevo modal
import WelcomeScreen from "./Components/WelcomeScreen"; // Pantalla de bienvenida
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
  const { isSubscribed, offerings, loading, purchasePackage, restorePurchases } = useSubscription();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const [appState, setAppState] = useState('loading'); // 'loading', 'welcome', 'ready'

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
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <NavigationContainer>
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
        <Toast />
      </NavigationContainer>

      {/* El modal del disclaimer se renderiza aquí, por encima de todo */}
      <DisclaimerModal
        visible={isDisclaimerVisible}
        onClose={() => setIsDisclaimerVisible(false)}
      />
    </SafeAreaView>
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