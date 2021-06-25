import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import DetailsScreen from '../screens/detail';
import QRCodeGenerate from '../screens/generate/QRCodeGenerate';
import HistoryAttendance from '../screens/history/HistoryAttendance';
import HistorySubjects from '../screens/history/HistorySubjects';
import HistoryGenerate from '../screens/history/HistoryGenerate';
import HomeScreen from '../screens/home/HomeScreen';
import FaceScanScreen from '../screens/scan/FaceScanSceen';
import ScanScreen from '../screens/scan/ScanScreen';
import UpdatePassword from '../screens/settings/components/UpdatePassword';
import SettingsScreen from '../screens/settings/SettingsScreen';
import TabNavigator from './TabNavigator';
import SubjectDetail from '../screens/history/SubjectDetail';


const Stack = createStackNavigator();

const HomeStackNavigator = ({ }) => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
                name="Scan" component={ScanScreen}
                options={{
                    headerTitle: false,
                    headerShown: true,
                    headerTransparent: true,
                }}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="QRCodeGenerate" component={QRCodeGenerate} options={{ title: 'Tạo mã QR' }} />
            <Stack.Screen name="HistoryGenerate" component={HistoryGenerate} options={{ title: 'Lịch sử tạo mã QR' }} />
            <Stack.Screen name="HistoryAttendance" component={HistoryAttendance} options={{ title: 'Lịch sử điểm danh' }} />
            <Stack.Screen name="HistorySubjects" component={HistorySubjects} options={{ title: 'Danh sách môn học' }} />

            {/* Modal */}
            <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ title: 'Thay đổi mật khẩu' }} />
            <Stack.Screen name="SubjectDetail" component={SubjectDetail}
                options={{
                    headerTitle: false,
                    headerTransparent: true,
                }} />

        </Stack.Navigator>
    );
}

const SettingsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
}

export {
    HomeStackNavigator,
    SettingsStackNavigator
};
