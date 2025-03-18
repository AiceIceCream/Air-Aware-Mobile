import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, LogBox } from "react-native";
import globalstyles from "./src/config/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import colors from "./src/config/colors";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import registerNNPushToken from 'native-notify';


import LandingScreen from "./src/components/screens/LandingScreen";
import HomeScreen from "./src/components/screens/HomeScreen";
import SettingsScreen from "./src/components/screens/SettingsScreen";
import Pm10Screen from "./src/components/screens/Pm10Screen";
import TemperatureScreen from "./src/components/screens/TemperatureScreen";
import HumidityScreen from "./src/components/screens/HumidityScreen";
import OxygenScreen from "./src/components/screens/OxygenScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  registerNNPushToken(25377, 'LQatvdKdvUR3CphXWPIXZF');
  const theme = {
    ...DefaultTheme,
    colors: colors.colors,
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">

            <Stack.Screen
              options={{ headerShown: false }}
              name="Landing"
              component={LandingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Setting"
              component={SettingsScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Pm10"
              component={Pm10Screen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Temperature"
              component={TemperatureScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Humidity"
              component={HumidityScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Oxygen"
              component={OxygenScreen}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

const styles = StyleSheet.create(globalstyles);
