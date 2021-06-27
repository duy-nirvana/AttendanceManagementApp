import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { ScrollView, View, Button } from 'react-native';
import { Text } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/stack';


const QRCodeDetail = ({ handleOpenQRCode }) => {
    const headerHeight = useHeaderHeight();
    const [isLoading, setLoading] = useState(false);

    return (
        <View style={{padding: 10, marginTop: headerHeight}}>
            <Text>fdsafsdafsdfsadhdfss alaba trap</Text>
        </View>
    )
};

export default QRCodeDetail;