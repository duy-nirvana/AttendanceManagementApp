import moment from 'moment-timezone';
import 'moment/locale/vi'; // without this line it didn't work
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { ActivityIndicator, Chip, Divider, Subheading, TextInput, Title } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import slugify from 'slugify';
import historyApi from '../../api/historyApi';
import qrcodeApi from '../../api/qrcodeApi';

const fullWidth = Dimensions.get("screen").width;

const HistoryAttendance = (props) => {
    const {handleOpenHistory} = props;
    const profileUser = useSelector(state => state.profile.profile);
    const [historyInfo, setHistoryInfo] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [QRCodeByClass, setQRCodeByClass] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            await qrcodeApi.getByUserId(profileUser._id)
            .then(res => {
                setHistoryInfo(res);
                setLoading(false);
            })

            await qrcodeApi.getByClassId(profileUser.classroom._id)
            .then(res => {
                setQRCodeByClass(res);
            })
        }

        fetchHistory();
    }, [])

    console.log(historyInfo)
    const filterSubjects = (histories) => {
        const removeMarkSearchString = slugify(searchInput, {
            replacement: ' ',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi'
        })

        return histories && histories.filter((history) => {
            return slugify(history.subject[0].name, {
                replacement: ' ',
                remove: undefined,
                lower: true,
                strict: false,
                locale: 'vi'
            }).includes(removeMarkSearchString)
        })
    }

    const renderHistory = filterSubjects(historyInfo);

    // const countTotalCurrent = (id) => {
    //     let count = 0;
    //     historyInfo.filter(history => {
    //         if (history?.qrcode.subject[0]?._id === id) {
    //             count++;
    //         }
    //     })

    //     return count;
    // }

    return (
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}} >
                <TextInput
                    placeholder="Tìm lịch sử điểm danh"
                    mode="outlined"
                    value={searchInput}
                    theme={{ colors: { primary: 'black', underlineColor:'transparent' }}}
                    style={{width: '100%',  backgroundColor: 'white'}}
                    onChangeText={(value) => setSearchInput(value)}
                />
                {/* <MaterialCommunityIcons name="close" size={40} color="#000" onPress={() => handleOpenHistory(false)} /> */}
            </View>
            <ScrollView
                style={{marginBottom: 80}}
            >
                    {isLoading &&
                        <ActivityIndicator
                            animating={true}
                            color="#000"
                        />
                    }
                    {
                        renderHistory ?
                        renderHistory.map(history => (
                            <View
                                key={history._id}
                                style={{ padding: 10}}
                            >
                                {
                                    history.subject.map(subject => (
                                        <Title
                                            key={subject._id}
                                            style={{marginBottom: 5}}
                                        >
                                            {subject.name}
                                        </Title>
                                    ))
                                }
                                <View style={{flexWrap: 'wrap', flexDirection: "row", marginBottom: 5}}>
                                    {
                                        history.classes.map(classes => (
                                            <Chip
                                                key={classes._id}
                                                style={{backgroundColor: '#235789', marginRight: 5, marginTop: 5}}
                                            >
                                                <Subheading style={{color: '#fff'}}>{classes.name}</Subheading>
                                            </Chip>
                                        ))
                                    }
                                </View>
                                {/* <Subheading>Đã điểm danh: {countTotalCurrent(history.subject[0]._id)} / {history.subject[0].total} buổi</Subheading>
                                <Subheading>{`Vắng: ${countTotalQRCode(history.subject[0]._id) - countTotalCurrent(history.subject[0]._id)} buổi`}</Subheading> */}
                                {
                                    history.description ?
                                    <Subheading>Chú thích: {history.description}</Subheading>
                                    : null
                                }
                                <Subheading>Thời gian: {moment(history.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss, dddd DD/MM/YYYY')}</Subheading>
                                <Divider style={{marginTop: 15}}/>
                            </View>

                        ))
                        :
                        <Text>Bạn chưa có lịch sử điểm danh</Text>
                    }
            </ScrollView>
        </View>
    )
}

export default HistoryAttendance;