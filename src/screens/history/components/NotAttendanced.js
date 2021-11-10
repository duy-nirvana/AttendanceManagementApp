import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Icon, Text, Badge } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const NotAttendanced = ({ subjects }) => {
    const [isLoading, setLoading] = useState(false);
    const navigation = useNavigation();

    // const filterQRCode = () => {
    //     const qrcodeSubjectID = subjects.map((sub) => sub.qrcode.subject._id);
    //     const subjectIDs = subjects.map((sub) => sub.qrcode._id);

    //     const qrcodesFiltered = qrcodes.filter(qrcode => {
    //         return qrcodeSubjectID.indexOf(qrcode.subject[0]._id) !== -1;
    //     })

    //     let result = qrcodesFiltered.filter(qrcode => {
    //         return subjectIDs.indexOf(qrcode._id) === -1;
    //     })
    //     return result;
    // }

    // const subjectsNotAttendance = filterQRCode();

    return (
        <>
            <ScrollView style={{ flex: 1 }}>
                {isLoading &&
                    <ActivityIndicator
                        animating={true}
                        color="#000"
                    />
                }
                {
                    subjects ? subjects.map(subject => (
                        <View
                            key={subject._id}
                            style={{
                                marginTop: 5,
                                padding: 8
                            }}
                        >

                            <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 5 }}>
                                {
                                    subject.classes.map(classes => (
                                        <Chip
                                            key={classes._id}
                                            style={{
                                                backgroundColor: '#555',
                                                marginRight: 5,
                                                marginBottom: 5
                                            }}
                                        >
                                            <Subheading style={{ color: '#fff' }}>
                                                {classes.name}
                                            </Subheading>
                                        </Chip>
                                    ))
                                }
                            </View>
                            <View style={{ alignItems: 'center', flexWrap: 'wrap', flexDirection: "row" }}>
                                <Subheading style={{ flex: 1, flexWrap: 'wrap' }}>{moment(subject.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                                <Badge 
                                    status={subject.isOutOfDate ? 'error' : 'success'} 
                                    badgeStyle={{marginRight: 5}}
                                />
                                <Icon
                                    name='qrcode'
                                    type='material-community'
                                    size={35}
                                    style={{ alignSelf: 'flex-end', backgroundColor: '#555', borderRadius: 50, padding: 20 }}
                                    onPress={() => navigation.navigate("QRCodeDetail", {
                                        subjectName: subject.name,
                                        qrcode: subject,
                                        createdAt: subject.createdAt
                                    })}
                                />
                            </View>

                            <Divider style={{ marginTop: 15 }} />


                        </View>

                    ))
                        :
                        <Text>Bạn chưa có lịch sử vắng</Text>
                }
            </ScrollView>
        </>
    )
};

export default NotAttendanced;