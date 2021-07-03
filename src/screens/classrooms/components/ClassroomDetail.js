import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { ActivityIndicator, Chip, Divider, Subheading, TextInput, Title, Switch } from 'react-native-paper';
import { useSelector } from 'react-redux';
import historyApi from '../../../api/historyApi';
import { useHeaderHeight } from '@react-navigation/stack';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ClassroomAttendanced from './ClassroomAttendanced';
import ClassroomNotAttendanced from './ClassroomNotAttendanced';


const fullWidth = Dimensions.get("screen").width;
const fullHeight = Dimensions.get("screen").height;

const renderTabBar = props => (
    <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'navy', height: 5 }}
        style={[styles.blueBg]}
        labelStyle={{ color: "red" }}
    />
);

const ClassroomDetail = ({ route: { params }, navigation }) => {
    const { qrcode } = params;
    const profileUser = useSelector(state => state.profile.profile);
    const [subjectDetail, setSubjectDetail] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [QRCodeByClass, setQRCodeByClass] = useState([]);
    const headerHeight = useHeaderHeight();
    const [users, setUsers] = useState([]);
    const [qrcodes, setQRCodes] = useState([]);

    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Đã điểm danh' },
        { key: 'second', title: 'Chưa điểm danh' },
    ]);

    useEffect(() => {
        const getQRCodes = async () => {
            setLoading(true);
            try {
                const res = await historyApi.getQRCodes(qrcode._id)
                if (res) {
                    setQRCodes(res);
                }
            } catch (e) {
                console.log('fail to get qrcodes ', e);
            }
        }

        getQRCodes();
    }, [qrcodes])

    const allClasses = qrcode.classes.map(classroom => classroom._id);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <ClassroomAttendanced  qrcodes={qrcodes} />;
            case 'second':
                return <ClassroomNotAttendanced classes={allClasses} usersAttendance={qrcodes} />;
            default:
                return null;
        }
    }

    return (
        <View
            style={{ flex: 1, justifyContent: 'space-between', marginTop: headerHeight, padding: 10 }}
        >

            <View style={[styles.box_shadow, styles.blueBg, { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }]} >
                <View style={{ backgroundColor: '#235789', textAlign: 'center', padding: 10, alignSelf: 'center', borderRadius: 10 }}>
                    <Text h4 style={{ color: "white" }}>
                        {qrcode.subject[0].name}
                    </Text>
                </View>
                <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 10 }}>
                    {
                        qrcode.classes.map(classroom => (
                            <Chip
                                key={classroom._id}
                                style={[ styles.orangeBg, { marginRight: 5, marginTop: 5 }]}
                            >
                                <Subheading style={{ color: '#fff' }}>{classroom.name}</Subheading>
                            </Chip>
                        ))
                    }
                </View>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    {
                        qrcode.isOutOfDate ?
                            <Chip style={styles.redBg}>
                                <Subheading style={{ color: '#fff' }}>Mã đã hết hạn</Subheading>
                            </Chip>
                            :
                            <Chip style={styles.greenBg}>
                                <Subheading style={{ color: '#fff' }}>Còn hạn sử dụng</Subheading>
                            </Chip
                            >}
                </Text>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    {moment(qrcode.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:s - dddd DD/MM/YYYY')}
                </Text>
            </View>
             <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={{ height: fullHeight }}
            />
        </View>
    )
}

export default ClassroomDetail;

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