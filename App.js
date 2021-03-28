// import 'react-native-gesture-handler';
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { HomeStackNavigator, SettingsStackNavigator } from './src/navigators/StackNavigator';
// import LoginScreen from './src/screens/login/LoginScreen';

//  const App = () => {
//   return (
//     // <NavigationContainer>
//     //   {/* <HomeStackNavigator /> */}
//     //   <LoginScreen />
//     // </NavigationContainer>
//     <LoginScreen />
//   );
// }


// export default App;
import React from 'react';
import {StyleSheet, Text, View, StatusBar } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { HomeStackNavigator, SettingsStackNavigator } from './src/navigators/StackNavigator';


// import Navigator from './src/navigators';
import {Provider} from 'react-redux';
import store from './store';
import LoginScreen from './src/screens/login/LoginScreen';

export default function App() {

    return (
        <Provider store={store}>
            <NavigationContainer >
                {/* <LoginScreen /> */}
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
