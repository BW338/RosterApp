import React from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useSubscription } from "./hooks/useSubscription";
import RosterPannel from "./Screens/RosterPannel";
import RosterScreen from "./Screens/RosterScreen";
import Calendar from "./Screens/Calendar";
import Calculator from "./Screens/Calculator";
import ScreenB from "./Screens/ScreenB";
import FlexScreen from "./Screens/Flex";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RosterStack({ isSubscribed, offerings }) {
  return (
    <Stack.Navigator initialRouteName="RosterScreen">
      <Stack.Screen
        name="RosterScreen"
        component={RosterScreen}
        options={{ title: "Actualizar plan de vuelo" }}
      />
      <Stack.Screen name="RosterPannel" options={{ title: "Roster" }}>
        {(props) => (
          <RosterPannel
            {...props}
            isSubscribed={isSubscribed}
            offerings={offerings}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


export default function App() {
  const { isSubscribed, offerings, loading } = useSubscription();

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#3983f1",
          tabBarInactiveTintColor: "#888",
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Roster") {
              iconName = "airplane-outline";
            } else if (route.name === "Calendar") {
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
          {() => (
            <RosterStack isSubscribed={isSubscribed} offerings={offerings} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Calendar" component={Calendar} />

        <Tab.Screen name="Calculador" component={Calculator} />
        <Tab.Screen name="Viaticos" component={ScreenB} />
        <Tab.Screen name="Flex" component={FlexScreen} />

      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
