import { useHeaderHeight } from '@react-navigation/stack';
import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, FlatList } from 'react-native';
import { ActivityIndicator, Chip, Divider, Subheading, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import qrcodeApi from '../../api/qrcodeApi';

const fullWidth = Dimensions.get("screen").width;

const ClassroomScreen = (props) => {
    const { handleOpenqrcode, navigation } = props;
    const profileUser = useSelector(state => state.profile.profile);
    const [qrcodes, setQRCodes] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        const fetchQRCodes = async () => {
            setLoading(true);
            try {
                const res = await qrcodeApi.getByUserId(profileUser._id);
                setQRCodes(res);
                setLoading(false);
            } catch (e) {
                setLoading(false)
                console.log('can not get qrcodes: ', e);
            }

        }

        fetchQRCodes();
    }, []);

    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity
                key={item._id}
                style={{ padding: 10 }}
                onPress={() => navigation.navigate('ClassroomDetail', {
                    qrcode: item
                })}
            >
                <View>
                    {
                        item.subject.map(subject => (
                            <Title
                                key={subject._id}
                                style={{ marginBottom: 5 }}
                            >
                                {subject.name}
                            </Title>
                        ))
                    }
                    <Text>khong diem danh: {item.not_attendance_user.length}</Text>
                    <Text>da diem danh: {item.attendance_user.length}</Text>
                    <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 15 }}>
                        {
                            item.classes.map(classes => (
                                <Chip
                                    key={classes._id}
                                    style={{ backgroundColor: '#235789', marginRight: 5, marginTop: 5 }}
                                >
                                    <Subheading style={{ color: '#fff' }}>{classes.name}</Subheading>
                                </Chip>
                            ))
                        }
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {
                            item.isOutOfDate ?
                                <Chip style={styles.redBg}>
                                    <Subheading style={{ color: '#fff' }}>Mã đã hết hạn</Subheading>
                                </Chip>
                                :
                                <Chip style={styles.greenBg}>
                                    <Subheading style={{ color: '#fff' }}>Còn hạn sử dụng</Subheading>
                                </Chip>
                        }
                    </View>
                    {
                        item.description ?
                            <Subheading>
                                Chú thích: {item.description}
                            </Subheading>
                            :
                            null
                    }
                    <Subheading>Ngày tạo mã: {moment(item.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                    <Divider style={{ marginTop: 15 }} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <SafeAreaView
                style={{ marginTop: headerHeight }}
            >
                {isLoading &&
                    <ActivityIndicator
                        animating={true}
                        color="#000"
                    />
                }
                {
                    qrcodes.length !== 0 ?
                        <FlatList
                            data={qrcodes}
                            renderItem={renderItem}
                            keyExtractor={(qrcode) => qrcode._id}
                        />

                        :
                        <Text></Text>

                }
            </SafeAreaView>
        </View>
    )
}

export default ClassroomScreen;

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
        height: 80,
        borderRadius: 10,

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