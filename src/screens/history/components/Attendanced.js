import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading } from 'react-native-paper';

const Attendanced = ({ subjects }) => {
    const [isLoading, setLoading] = useState(false);

    return (
        <ScrollView style={{ flex: 1 }}>
            {isLoading &&
                <ActivityIndicator
                    animating={true}
                    color="#000"
                />
            }
            {
                subjects ?
                    subjects.map(subject => (
                        <View
                            key={subject._id}
                            style={{ padding: 10 }}
                        >
                            <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 5 }}>
                                {
                                    subject.qrcode.classes.map(classes => (
                                        <Chip
                                            key={classes._id}
                                            style={{ backgroundColor: '#235789', marginRight: 5, marginTop: 5 }}
                                        >
                                            <Subheading style={{ color: '#fff' }}>{classes.name}</Subheading>
                                        </Chip>
                                    ))
                                }
                            </View>
                            {
                                subject.qrcode.description ?
                                    <Subheading>Chú thích: {subject.qrcode.description}</Subheading>
                                    : null
                            }
                            <Subheading>Thời gian: {moment(subject.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                            <Divider style={{ marginTop: 15 }} />
                        </View>

                    ))
                    :
                    <Text>Bạn chưa có lịch sử điểm danh</Text>
            }
        </ScrollView>
    )
};

export default Attendanced;