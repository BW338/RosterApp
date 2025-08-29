// App.js
import React from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RosterView from "./Screens/RosterView";
import ScreenA from "./Screens/ScreenA";
import ScreenB from "./Screens/ScreenB";
import ScreenC from "./Screens/ScreenC";
import { useSubscription } from "./hooks/useSubscription";
import Toast from "react-native-toast-message";

const Tab = createBottomTabNavigator();

export default function App() {
  const { isSubscribed, offerings, loading } = useSubscription();

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
          {() => <RosterView isSubscribed={isSubscribed} offerings={offerings} />}
        </Tab.Screen>
        <Tab.Screen name="Screen A" component={ScreenA} />
        <Tab.Screen name="Screen B" component={ScreenB} />
        <Tab.Screen name="Screen C" component={ScreenC} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
