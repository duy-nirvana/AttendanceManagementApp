import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading } from 'react-native-paper';

import historyApi from '../../../api/historyApi';

const ClassroomAttendanced = ({ qrcodeId }) => {
    const [isLoading, setLoading] = useState(false);
    const [qrcodes, setQRCodes] = useState([]);

    useEffect(() => {
        const getQRCodes = async () => {
            setLoading(true);
            try {
                const res = await historyApi.getQRCodes(qrcodeId)
                if (res) {
                    setQRCodes(res);
                }
                setLoading(false)
            } catch (e) {
                console.log('fail to get qrcodes ', e);
            }
        }

        getQRCodes();
    }, [])

    console.log(qrcodes);

    return (
        <ScrollView style={{ flex: 1 }}>
            {isLoading &&
                <ActivityIndicator
                    animating={true}
                    color="#000"
                />
            }
            {
                qrcodes ?
                    qrcodes.map(qrcode => (
                        <View
                            key={qrcode._id}
                            style={{ padding: 10 }}
                        >
                            <Subheading>{qrcode.user.fullName}</Subheading>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text>Lớp </Text>
                                <Chip
                                    style={{ backgroundColor: '#235789' }}
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
                    <Text>Chưa có sinh viên điểm danh</Text>
            }
        </ScrollView>
    )
};

export default ClassroomAttendanced;