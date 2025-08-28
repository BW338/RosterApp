// routes/homeStack.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RosterView from "../Components/Roster/RosterView";
import ProfileScreen from "../Components/Profile/ProfileScreen";
import SettingsScreen from "../Components/Settings/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Roster" component={RosterView} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const HomeStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Podés agregar Splash/Login acá si querés */}
        <Stack.Screen name="Main" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
