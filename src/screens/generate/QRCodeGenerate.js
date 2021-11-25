import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, Text, Dimensions, StyleSheet, StatusBar, SafeAreaView, Alert, ScrollView, LogBox} from 'react-native';
import { Button, ActivityIndicator, TextInput} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

import classApi from '../../api/classApi';
import qrcodeApi from '../../api/qrcodeApi';
import subjectApi from '../../api/subjectApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MultiSelect from 'react-native-multiple-select';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';

const fullWidth = Dimensions.get('screen').width;

const QRCodeGenerate = (props) => {
    const {handleOpenQRCode} = props;
    const profileUser = useSelector(state => state.profile.profile);
    const [hasSettingQRCode, setSettingQRCode] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subject, setSubject] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState([]);
    const [selectedTime, setSelectedTime] = useState(30000);
    const [infoQRCode, setInfoQRCode] = useState(null);
    const [descriptionQRCode, setDescriptionQRCode] = useState('');
    const [isLoading, setLoading] = useState(false);

    const stringQRCode = {
        classes: selectedClasses,
        subject: selectedSubject,
        time: selectedTime,
        owner: profileUser._id,
        description: descriptionQRCode
    }

    const checkInfoIsNotEmpty = () => {
        if (stringQRCode.classes.length === 0) {
            Alert.alert(
                "QRCODE",
                "Lớp học không được để trống",
                [
                  {
                    text: "OK",
                  },
                ],
                { cancelable: false }
            );
        }

        if (stringQRCode.subject.length === 0) {
            Alert.alert(
                "QRCODE",
                "Môn học không được để trống",
                [
                  {
                    text: "OK",
                  },
                ],
                { cancelable: false }
            );
        }

        if (stringQRCode.classes.length > 0 && stringQRCode.subject.length > 0) {
            verifyCreateQRCode();
        }

    }

    const verifyCreateQRCode = () => {
        Alert.alert(
            "QRCODE",
            "Bạn có đồng ý tạo mã QRCode?",
            [
              {
                text: "Hủy",
              },
              { text: "Đồng ý", onPress: () => generateQRCode() }
            ],
            { cancelable: false }
        );
    }

    const verifyCloseQRCode = () => {
        Alert.alert(
            "QRCODE",
            "Xác nhận thoát?",
            [
              {
                text: "Hủy",
              },
              { text: "Đồng ý", onPress: () => setSettingQRCode(false) }
            ],
            { cancelable: false }
        );
    }

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await classApi.getAll();
                const filterClasses = res.filter(classes => classes.name !== 'HUTECH')
                setClasses(filterClasses);
            } catch (err) {
                console.log('fail to fetch data classes', err);
            }
        }
        const fetchSubject = async () => {
            try {
                const res = await subjectApi.getAll();
                setSubject(res);
            } catch (err) {
                console.log('fail to fetch data subject', err);
            }
        }

        fetchClasses();
        fetchSubject();
    }, [])

    useEffect(() => {
        LogBox.ignoreAllLogs();
    }, [])

    // const convertSubject = (subjectId) => {
    //     return subject.filter(sub => {
    //         return sub._id === subjectId
    //     }).map(sub => {
    //         return sub.name;
    //     })
    // }

    // const sendQRToMail = {

    // }

    const generateQRCode = () => {
        try {
            setLoading(true);
            qrcodeApi.createOne(stringQRCode)
            .then((data) => {
                setLoading(false);
                setInfoQRCode(data.qrcode._id);
                setSettingQRCode(true);
                qrcodeApi.updateById(data.qrcode._id);
                subjectApi.getById(selectedSubject).then((sub) => {
                    qrcodeApi.sendMail({
                        subject: sub.name,
                        mail: profileUser.email,
                        qrcode: data.qrcode._id
                    })
                    .then(() => {
                        Toast.show(`Mã QR đã được gửi tới email của bạn`, Toast.LONG);
                    })
                })
            })
        } catch (error) {
            setLoading(false);
            console.log('fail to post qrcode info', );
        }
    }

    console.log({stringQRCode});

    return (
        <ScrollView style={{flex: 1}}>
                <SafeAreaView style={{flex:1, alignItems: "center", backgroundColor: 'white'}}>
                    <View style={{flex: 1, marginLeft: 20, marginRight: 20}}>
                        <Text style={{marginBottom: 5, marginTop: 20, textAlign: 'center'}}>LỚP HỌC</Text>
                        <MultiSelect
                            items={classes}
                            uniqueKey="_id"
                            onSelectedItemsChange={setSelectedClasses}
                            selectedItems={selectedClasses}
                            selectText="Chọn lớp học"
                            searchInputPlaceholderText="Tìm lớp học..."
                            tagRemoveIconColor="#fff"
                            tagBorderColor="navy"
                            tagTextColor="#fff"
                            selectedItemTextColor="navy"
                            selectedItemIconColor="navy"
                            itemTextColor="#aaa"
                            displayKey="name"
                            searchInputStyle={{ color: '#CCC' }}
                            tagContainerStyle={{backgroundColor: "navy", width: fullWidth * 0.35}}
                            submitButtonColor="navy"
                            hideSubmitButton={true}
                            fixedHeight={true}
                        />
                        <Text style={{marginBottom: 5, marginTop: 20, textAlign: 'center'}}>MÔN HỌC</Text>
                        <MultiSelect
                            single={true}
                            items={subject}
                            uniqueKey="_id"
                            //ref={(component) => { multiSelect = component }}
                            onSelectedItemsChange={setSelectedSubject}
                            selectedItems={selectedSubject}
                            selectText="Chọn môn học"
                            searchInputPlaceholderText="Tìm môn học..."
                            tagRemoveIconColor="#2d88ff"
                            tagBorderColor="#2d88ff"
                            tagTextColor="#2d88ff"
                            selectedItemTextColor="navy"
                            selectedItemIconColor="navy"
                            itemTextColor="#aaa"
                            displayKey="name"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="navy"
                            submitButtonText="Chọn"
                        />
                        <Text style={{marginBottom: 5, marginTop: 20, textAlign: 'center'}}>THỜI GIAN</Text>
                        <Picker
                            selectedValue={selectedTime}
                            style={{height: 50, width: fullWidth * 0.9}}
                            onValueChange={(itemValue, itemIndex) => setSelectedTime(itemValue)}>
                            <Picker.Item label="30 giây" value={30000} />
                            <Picker.Item label="1 phút" value={60000} />
                            <Picker.Item label="1 phút 30 giây" value={90000} />
                            <Picker.Item label="2 phút" value={120000} />
                            <Picker.Item label="3 phút" value={180000} />
                            <Picker.Item label="4 phút" value={240000} />
                            <Picker.Item label="5 phút" value={300000} />
                        </Picker>

                        <Text style={{marginBottom: 5, marginTop: 20, textAlign: 'center'}}>MÔ TẢ</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            mode="outlined"
                            theme={{ colors: { primary: 'black', underlineColor:'transparent' }}}
                            style={{width: fullWidth * 0.9, marginBottom: 15}}
                            value={descriptionQRCode}
                            onChangeText={(value) => setDescriptionQRCode(value)}
                        />

                        <Button
                            mode="outlined"
                            color="white"
                            style={{width: fullWidth * .9,  backgroundColor: 'navy', padding: 10, marginTop: 30}}
                            onPress={checkInfoIsNotEmpty}
                        >
                            Tạo mã QR Code
                        </Button>
                    </View>

                        {
                        <Modal visible={hasSettingQRCode}
                        >
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
                                {
                                    isLoading ?
                                    <ActivityIndicator
                                        animating={true}
                                        color="#000"
                                    />
                                    :
                                    <QRCode
                                        size={fullWidth * 0.9}
                                        value={infoQRCode}
                                    />
                                }
                            </View>
                            <Button onPress={verifyCloseQRCode}>
                                <Text style={{color: '#000'}}>Thoát</Text>
                            </Button>
                        </Modal>
                        }
                </SafeAreaView>

        </ScrollView>
    )
}

export default QRCodeGenerate;