import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { HomeStackNavigator, SettingsStackNavigator } from './src/navigators/StackNavigator';

 const App = () => {
  return (
    <NavigationContainer>
      <HomeStackNavigator />
    </NavigationContainer>
  );
}
export default App;