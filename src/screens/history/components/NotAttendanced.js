import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading } from 'react-native-paper';

const NotAttendanced = ({ qrcodes, subjects }) => {
    const [isLoading, setLoading] = useState(false);

    const filterQRCode = () => {
        return qrcodes.filter(qrcode => {
            return qrcode?.subject[0]._id === subjects[0]?.qrcode.subject._id;
        })
        .filter((qrcode, index) => {
            return qrcode._id !== subjects[index]?.qrcode._id
        })
    }
    const subjectsNotAttendance =  filterQRCode();

    return (
        <ScrollView style={{ flex: 1 }}>
            {isLoading &&
                <ActivityIndicator
                    animating={true}
                    color="#000"
                />
            }
            {
                subjectsNotAttendance ?
                    subjectsNotAttendance.map(subject => (
                        <View
                            key={subject._id}
                            style={{ padding: 10 }}
                        >
                            <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 5 }}>
                                {
                                    subject.classes.map(classes => (
                                        <Chip
                                            key={classes._id}
                                            style={{ backgroundColor: '#235789', marginRight: 5, marginTop: 5 }}
                                        >
                                            <Subheading style={{ color: '#fff' }}>{classes.name}</Subheading>
                                        </Chip>
                                    ))
                                }
                            </View>
                            <Subheading>Thời gian: {moment(subject.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                            <Divider style={{ marginTop: 15 }} />
                        </View>

                    ))
                    :
                    <Text>Bạn chưa có lịch sử vắng</Text>
            }
        </ScrollView>
    )
};

export default NotAttendanced;