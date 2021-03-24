import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import DetailsScreen from '../screens/detail';
import HomeScreen from '../screens/home/HomeScreen';
import ScanScreen from '../screens/scan/ScanScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import TabNavigator from './TabNavigator';


const Stack = createStackNavigator();

const HomeStackNavigator = ({}) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
      <Stack.Screen 
        name="Scan" component={ScanScreen} 
        options={{
          headerTitle: false,
          headerShown: true,
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Details" component={DetailsScreen}/>
    </Stack.Navigator>
  );
}

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export {
    HomeStackNavigator,
    SettingsStackNavigator
};
