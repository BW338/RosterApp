  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import RosterPannelScreen from "../Screens/RosterPannel";
  import Calendar from "../Screens/Calendar";
  import CalculatorScreen from "../Screens/Calculator";
  import Flex from "../Screens/Flex";
import ViaticosScreen from "../Screens/Viaticos";

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
        <Tab.Screen name="Calendar" component={Calendar} />
        <Tab.Screen name="Pannel" component={RosterPannelScreen} />
        <Tab.Screen name="Claculator" component={CalculatorScreen} />
        <Tab.Screen name="Viaticos" component={ViaticosScreen} />
        <Tab.Screen name="Flex" component={Flex} />
      </Tab.Navigator>
    );
  }
