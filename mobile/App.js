import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CompetitionListScreen from "./screens/CompetitionListScreen";
import CompetitionDetailsScreen from "./screens/CompetitionDetailsScreen";
import RegistrationSuccessScreen from "./screens/RegistrationSuccessScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Competitions"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Competitions"
          component={CompetitionListScreen}
        />

        <Stack.Screen
          name="CompetitionDetails"
          component={CompetitionDetailsScreen}
        />

        <Stack.Screen
          name="RegistrationSuccess"
          component={RegistrationSuccessScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}