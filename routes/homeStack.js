  import React from "react";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import RosterPannel from "../Screens/RosterPannel";
    import Calendar from "../Screens/Calendar";
  import ScreenA from "../Screens/ScreenA";
  import ScreenB from "../Screens/ScreenB";
  import ScreenC from "../Screens/ScreenC";

  const Tab = createBottomTabNavigator();

  export default function HomeStack() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3983f1",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tab.Screen name="Pannel" component={RosterPannel} />
        <Tab.Screen name="Screen A" component={ScreenA} />
        <Tab.Screen name="Screen B" component={ScreenB} />
        <Tab.Screen name="Screen C" component={ScreenC} />
      </Tab.Navigator>
    );
  }
