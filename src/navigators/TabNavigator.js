import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import HomeScreen from '../screens/home/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    
    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;
            
            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                // Restoring token failed
                console.log('Fail to get token', e);
            }
            
            // After restoring token, we may need to validate it in production apps
            
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
        
        bootstrapAsync();
    }, []);

    return (
        <>
            {
                auth.userToken === null ? (
                    <LoginScreen />
                    ) : (
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
                            activeTintColor: '#1878f3',
                            inactiveTintColor: 'gray',
                            showLabel: false
                        }}>
                        <Tab.Screen name="Home" component={HomeScreen} />
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                    ) 
            }
        </>
    );
}

export default TabNavigator;
