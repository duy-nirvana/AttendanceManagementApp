import 'moment/locale/vi'; // without this line it didn't work
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import historyApi from '../../api/historyApi';
import qrcodeApi from '../../api/qrcodeApi';

const fullWidth = Dimensions.get("screen").width;

const SubjectDetail = ({ route: { params } }) => {
    const { subjectID } = params;
    const profileUser = useSelector(state => state.profile.profile);
    const [subjectDetail, setSubjectDetail] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [QRCodeByClass, setQRCodeByClass] = useState([]);

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
            if (qrcode?.subject[0] === id) {
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

    return (
        <View
            style={{ marginTop: 50, padding: 10 }}
        >
            <View style={[styles.box_shadow, styles.blueBg]} >
                <Text h3 style={{ color: "white", lineHeight: 40 }}>
                    {subjectDetail[0]?.qrcode.subject.name}
                </Text>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    Giảng viên: {subjectDetail[0]?.qrcode.user[0].fullName}
                </Text>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    {`Đã điểm danh: ${subjectDetail.length} / ${subjectDetail[0]?.qrcode.subject.total} buổi`}
                </Text>
                <Text h4 style={{ color: "white", lineHeight: 40 }}>
                    {`Vắng: ${countTotalQRCode(subjectID) - subjectDetail.length} buổi`}
                </Text>
                <Button
                    title="Điểm danh"
                    titleStyle={{fontSize: 20, color: 'white', lineHeight: 40}}
                    buttonStyle={[styles.redBg]}
                />
            </View>
            <ScrollView
                style={{ marginBottom: 80 }}
            >
                {isLoading &&
                    <ActivityIndicator
                        animating={true}
                        color="#000"
                    />
                }
                {

                }
            </ScrollView>
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