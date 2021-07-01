import moment from 'moment-timezone';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, Dimensions, ScrollView, View, Modal, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Chip, Divider, Subheading, TextInput, Title, Switch } from 'react-native-paper';
import { useSelector } from 'react-redux';
import slugify from 'slugify';
import qrcodeApi from '../../api/qrcodeApi';
import { useHeaderHeight } from '@react-navigation/stack';

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
    }, [])

    return (
        <View>
            <ScrollView
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
                        qrcodes.map(qrcode => (
                            <TouchableOpacity
                                key={qrcode._id}
                                style={{ padding: 10 }}
                                onPress={() => navigation.navigate('ClassroomDetail', {
                                    qrcode
                                })}
                            >
                                <View>
                                    {
                                        qrcode.subject.map(subject => (
                                            <Title
                                                key={subject._id}
                                                style={{ marginBottom: 5 }}
                                            >
                                                {subject.name}
                                            </Title>
                                        ))
                                    }
                                    <View style={{ flexWrap: 'wrap', flexDirection: "row", marginBottom: 15 }}>
                                        {
                                            qrcode.classes.map(classes => (
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
                                            qrcode.isOutOfDate ?
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
                                        qrcode.description ?
                                            <Subheading>
                                                Chú thích: {qrcode.description}
                                            </Subheading>
                                            :
                                            null
                                    }
                                    <Subheading>Ngày tạo mã: {moment(qrcode.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                                    <Divider style={{ marginTop: 15 }} />
                                </View>
                            </TouchableOpacity>


                        ))
                        :
                        <Text></Text>

                }
            </ScrollView>
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