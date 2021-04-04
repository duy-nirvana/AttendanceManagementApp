import React from 'react';
import {StyleSheet, Text, View, StatusBar } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { HomeStackNavigator, SettingsStackNavigator } from './src/navigators/StackNavigator';

// import Navigator from './src/navigators';
import {Provider} from 'react-redux';
import store from './store';

export default function App() {

    return (
        <Provider store={store}>
            <NavigationContainer >
                <HomeStackNavigator />
            </NavigationContainer>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
