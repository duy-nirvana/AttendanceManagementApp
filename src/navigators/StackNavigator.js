import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import DetailsScreen from '../screens/detail';
import QRCodeGenerate from '../screens/generate/QRCodeGenerate';
import HistoryAttendance from '../screens/history/HistoryAttendance';
import HistoryGenerate from '../screens/history/HistoryGenerate';
import HomeScreen from '../screens/home/HomeScreen';
import FaceScanScreen from '../screens/scan/FaceScanSceen';
import ScanScreen from '../screens/scan/ScanScreen';
import UpdatePassword from '../screens/settings/components/UpdatePassword';
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
      <Stack.Screen name="QRCodeGenerate" component={QRCodeGenerate} options={{ title: 'Tạo mã QR' }}/>
      <Stack.Screen name="HistoryGenerate" component={HistoryGenerate} options={{ title: 'Lịch sử tạo mã QR' }}/>
      <Stack.Screen name="HistoryAttendance" component={HistoryAttendance} options={{ title: 'Lịch sử điểm danh' }}/>

      {/* Modal */}
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ title: 'Thay đổi mật khẩu' }}/>

      {/* Face Scan */}
      <Stack.Screen
      name="FaceScan"
      component={FaceScanScreen}
      options={{
          headerTitle: false,
          headerShown: true,
          headerTransparent: true,
    }}/>

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
