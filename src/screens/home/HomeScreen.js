import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image, Text } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import userApi from '../../api/userApi';
import axios from 'axios';
import { Buffer } from 'buffer';

const background = require('../../assets/img/bg.png');

function HomeScreen({ navigation }) {
    const auth = useSelector(state => state.auth);
    const [roleUser, setRoleUser] = useState('');
    const [userProfile, setUserProfile] = useState({});
    const dispatch = useDispatch();

    const getFaceAvatar = async () => {
        const faceImage =
            await axios
                .get(userProfile.avatar, { responseType: 'arraybuffer' })
                .then(response => Buffer.from(response.data, 'binary').toString('base64'))

        dispatch({ type: 'GET_BASE64_AVATAR', payload: faceImage });
    }

    useEffect(() => {
        const userProfile = async () => {
            try {
                const user = await userApi.getDetail(auth.userToken);
                setRoleUser(user.roles);
                dispatch({ type: 'GET_PROFILE', payload: user });
                setUserProfile(user);
            } catch (error) {
                console.log('Fail to get detail user', error);
            }
        }

        userProfile();
    }, [])

    useEffect(() => {
        if (userProfile.avatar) getFaceAvatar();
    }, [userProfile]);

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={background}
                style={[styles.background_img, styles.justify_center]}
            >
                <Text h3 style={{ color: "white" }}>
                    iRollCall - Điểm danh mã QR
                </Text>
            </Image>
            <View style={styles.row}>
                <View
                    style={[styles.box_shadow, styles.greenBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_left}
                    >
                        <Icon name="scan" size={50} color="white" />
                        <Text h4 style={{ color: "white" }}>
                            Điểm danh
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={[styles.box_shadow, styles.blueBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('HistoryAttendance')}
                        style={styles.flex_left}
                    >
                        <Icon name="people-outline" size={50} color="white" />
                        <Text h4 style={{ color: "white" }}>
                            Lịch sử điểm danh
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {
                roleUser === 'moderator' &&
                <View style={styles.row}>
                    <View
                        style={[styles.box_shadow, styles.yellowBg]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate('QRCodeGenerate')}
                            style={styles.flex_left}
                        >
                            <Icon name="ios-qr-code-outline" size={50} color="white" />
                            <Text h4 style={{ color: "white" }}>
                                Tạo mã QR
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[styles.box_shadow, styles.redBg]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate('HistoryGenerate')}
                            style={styles.flex_left}
                        >
                            <FontAwesome5 name="history" size={50} color="white" />
                            <Text h4 style={{ color: "white" }}>
                                Lịch sử tạo mã QR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <View style={styles.row}>
                {
                    roleUser === 'moderator' &&
                    <View
                        style={[styles.box_shadow, styles.violetBg]}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ClassroomScreen')}
                            style={styles.flex_left}
                        >
                            <Icon name="book-outline" size={50} color="white" />
                            <Text h4 style={{ color: "white" }}>
                                Quản lý lớp học
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                <View
                    style={[styles.box_shadow, styles.orangeBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('HistorySubjects')}
                        style={styles.flex_left}
                    >
                        <Icon name="file-tray-full-outline" size={50} color="white" />
                        <Text h4 style={{ color: "white" }}>
                            Danh sách môn học
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

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
        width: '45%',
        margin: 5,
        marginBottom: 10,
        borderRadius: 10,
        padding: 15,

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
        height: 70,
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
    violetBg: {
        backgroundColor: "#541388"
    },
})

export default HomeScreen;