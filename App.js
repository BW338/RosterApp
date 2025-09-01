import React from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useSubscription } from "./hooks/useSubscription";
import RosterPannel from "./Screens/RosterPannel";
import RosterScreen from "./Screens/RosterScreen";
import ScreenA from "./Screens/ScreenA";
import ScreenB from "./Screens/ScreenB";
import ScreenC from "./Screens/ScreenC";

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
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3983f1",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tab.Screen name="Roster">
          {() => (
            <RosterStack isSubscribed={isSubscribed} offerings={offerings} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Screen A" component={ScreenA} />
        <Tab.Screen name="Screen B" component={ScreenB} />
        <Tab.Screen name="Screen C" component={ScreenC} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
