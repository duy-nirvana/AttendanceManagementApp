import 'moment/locale/vi'; // without this line it didn't work
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { ActivityIndicator, TextInput, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import historyApi from '../../api/historyApi';
import qrcodeApi from '../../api/qrcodeApi';
import { useHeaderHeight } from '@react-navigation/stack';

import Attendanced from './components/Attendanced';
import NotAttendanced from './components/NotAttendanced';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


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

const SubjectDetail = ({ route: { params }, navigation }) => {
    const { subjectID } = params;
    const profileUser = useSelector(state => state.profile.profile);
    const [subjectDetail, setSubjectDetail] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [QRCodeByClass, setQRCodeByClass] = useState([]);
    const headerHeight = useHeaderHeight();

    // EX
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Đã điểm danh' },
        { key: 'second', title: 'Chưa điểm danh' },
    ]);

    // const renderScene = SceneMap({
    //     first: Attendanced,
    //     second: NotAttendanced,
    // });

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <Attendanced subjects={subjectDetail} />;
            case 'second':
                return <NotAttendanced qrcodes={QRCodeByClass} subjects={subjectDetail} navigation={navigation}/>;
            default:
                return null;
        }
    }
    // -----------

    useEffect(() => {
        const fetchDetailSubject = async () => {
            setLoading(true);
            historyApi.getDetail(profileUser._id, subjectID)
                .then(res => {
                    setSubjectDetail(res);
                    setLoading(false);
                })

            qrcodeApi.getByClassId(profileUser.classroom._id)
                .then(res => {
                    setQRCodeByClass(res);
                })
        }

        fetchDetailSubject();
    }, [])

    const countTotalQRCode = (id) => {
        let count = 0;
        QRCodeByClass.filter(qrcode => {
            if (qrcode?.subject[0]._id === id) {
                count++;
            }
        })

        return count;
    }
    const filterQRCode = (id) => {
        return QRCodeByClass.filter(qrcode => {
            return qrcode?.subject[0] === id;
        })
    }

    const missingDays = countTotalQRCode(subjectID) - subjectDetail.length;

    return (
        <View
            style={{ flex: 1, justifyContent: 'space-between', marginTop: headerHeight, padding: 10 }}
        >

            <View style={[styles.box_shadow, styles.blueBg, { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }]} >
                <Chip style={{ backgroundColor: '#235789', textAlign: 'center', padding: 10, alignSelf: 'center' }}>
                    <Text h4 style={{ color: "white" }}>
                        {subjectDetail[0]?.qrcode.subject.name}
                    </Text>
                </Chip>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    Giảng viên: {subjectDetail[0]?.qrcode.user[0].fullName}
                </Text>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    {`Đã điểm danh: ${subjectDetail.length} / ${subjectDetail[0]?.qrcode.subject.total ? subjectDetail[0]?.qrcode.subject.total : 0} buổi`}
                </Text>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    {`Vắng: ${missingDays} buổi`}
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

export default SubjectDetail;

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
})