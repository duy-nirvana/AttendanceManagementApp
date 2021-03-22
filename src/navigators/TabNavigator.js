import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeStackNavigator, SettingsStackNavigator } from './StackNavigator';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let iconSize;

                if (route.name === 'Home') {
                    iconName = focused ? 'ios-home' : 'ios-home-outline';
                    iconSize = focused ? 30 : 25;
                } else if (route.name === 'Settings') {
                    iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    iconSize = focused ? 30 : 25;
                }

                return <Ionicons name={iconName} size={iconSize} color={color} />;
            },
        })}
        tabBarOptions={{
            activeTintColor: 'navy',
            inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
