import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Modal } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading, } from 'react-native-paper';

const NotAttendanced = ({ subjects }) => {
    const [isLoading, setLoading] = useState(false);

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
                                style={{ marginTop: 5 }}
                            >
                                <View 
                                    style={{ 
                                        flexDirection: 'row', 
                                        alignItems: 'center', 
                                        padding: 20,
                                        backgroundColor: subject.isOutOfDate ? '#75F57B' : '#f3425f'
                                    }}
                                >   
                                    <View>
                                        {
                                            subject.classes.map(classes => (
                                                <Chip
                                                    key={classes._id}
                                                    style={{ 
                                                        backgroundColor: '#555',
                                                        width: 100
                                                    }}
                                                >
                                                    <Subheading style={{ color: '#fff' }}>
                                                        {classes.name}
                                                    </Subheading>
                                                </Chip>
                                            ))
                                        }
                                        <Subheading style={{flex: 1, flexWrap: 'wrap', color: 'white'}}>Thời gian: {moment(subject.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                                    </View>
                                    <Icon
                                        name='qrcode'
                                        type='material-community'
                                        size={35}
                                        color='white'
                                        style={{ alignSelf: 'flex-end', backgroundColor: '#555', borderRadius: 50, padding: 20 }}
                                        onPress={() => navigation.navigate("QRCodeDetail", {
                                            subjectName: subject.subject[0].name,
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