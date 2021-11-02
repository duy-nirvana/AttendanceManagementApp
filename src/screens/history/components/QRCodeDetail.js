import { useHeaderHeight } from '@react-navigation/stack';
import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';

const fullWidth = Dimensions.get("screen").width;

const QRCodeDetail = ({ route: { params }, navigation }) => {
    const { qrcode, createdAt, subjectName } = params;
    const profileUser = useSelector(state => state.profile.profile);
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const headerHeight = useHeaderHeight();

    const handleScanQRCode = async () => {
        if (!qrcode.isOutOfDate) {
            navigation.navigate('FaceScanScreen', {
                qrcode: qrcode._id,
                user: profileUser._id,
            });
        } else {
            alert(`Mã QR Code đã hết hạn! `);
            setLoading(false);
            dispatch({ type: 'DELETE_QRCODE' })
            return;
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', padding: 10, marginTop: headerHeight }}>
            <View style={{ alignItems: 'center' }}>
                <Text h4>{subjectName}</Text>
                <Text h4>{moment(createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm - dddd DD/MM/YYYY')}</Text>
            </View>
            <QRCode
                size={fullWidth * 0.9}
                value={qrcode._id}
            />
            <Button
                disabled={qrcode.isOutOfDate ? true : false}
                mode="outlined"
                color="white"
                loading={isLoading}
                style={{ 
                    padding: 20, 
                    marginTop: 10,
                    backgroundColor: qrcode.isOutOfDate ? '#f3425f' : '#45bd63'
                }}
                onPress={handleScanQRCode}
            >
                Điểm danh
            </Button>

        </View>
    )
};

export default QRCodeDetail;

const styles = StyleSheet.create({
    row: {
        flex: .30,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    flex_left: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
    justify_center: {
        justifyContent: "center"
    },
    box_shadow: {
        width: '100%',
        height: 80,
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 2,
    },
    background_img: {
        width: '100%',
        height: 100,
        marginBottom: 10,
        padding: 15
    },
    redBg: {
        backgroundColor: "#f3425f"
    },
    blueBg: {
        backgroundColor: "#1878f3"
    },
    greenBg: {
        backgroundColor: "#45bd63"
    },
    yellowBg: {
        backgroundColor: "#f7b928"
    },
})