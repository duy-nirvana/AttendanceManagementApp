import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading } from 'react-native-paper';

import historyApi from '../../../api/historyApi';

const ClassroomAttendanced = ({ qrcodes }) => {
    const [isLoading, setLoading] = useState(false);
    // const [qrcodes, setQRCodes] = useState([]);

    // useEffect(() => {
    //     const getQRCodes = async () => {
    //         setLoading(true);
    //         try {
    //             const res = await historyApi.getQRCodes(qrcodeId)
    //             if (res) {
    //                 setQRCodes(res);
    //             }
    //             setLoading(false)
    //         } catch (e) {
    //             console.log('fail to get qrcodes ', e);
    //         }
    //     }

    //     getQRCodes();
    // }, [])

    return (
        <ScrollView style={{ flex: 1 }}>
            {isLoading &&
                <ActivityIndicator
                    animating={true}
                    color="#000"
                />
            }
            {
                qrcodes.length !== 0 ?
                    qrcodes.map(qrcode => (
                        <View
                            key={qrcode._id}
                            style={{ padding: 10 }}
                        >
                            <Text h4>{qrcode.user.fullName}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>Lớp </Text>
                                <Chip
                                    style={styles.orangeBg}
                                >
                                    <Subheading style={{ color: '#fff' }}>{qrcode.user.classroom.name}</Subheading>
                                </Chip>
                            </View>
                            {/* <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 5 }}>

                            </View>
                            {
                                qrcode.qrcode.description ?
                                    <Subheading>Chú thích: {qrcode.qrcode.description}</Subheading>
                                    : null
                            }
                            */}
                            <Subheading>Thời gian: {moment(qrcode.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                            <Divider style={{ marginTop: 15 }} />
                        </View>

                    ))
                    :
                    <Text h4>Chưa có sinh viên điểm danh</Text>
            }
        </ScrollView>
    )
};

export default ClassroomAttendanced;

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
        borderRadius: 10,
        justifyContent: 'center',
        padding: 20,

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
    orangeBg: {
        backgroundColor: "#EF6306"
    },
})