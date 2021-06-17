import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Face, { Enum, MatchFacesResponse, MatchFacesRequest, Image as FaceImage } from '@regulaforensics/react-native-face-api-beta'
import * as RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import { CircleMask, RestangleMask } from './components/Mask';

import qrcodeApi from '../../api/qrcodeApi';
import historyApi from '../../api/historyApi';

let image1 = new FaceImage();
let image2 = new FaceImage();

const ScanScreen = () => {
    const qrcodeInfo = useSelector(state => state.qrcode.qrcode);
    const profileUser = useSelector(state => state.profile.profile);
    const base64ImageAvatar = useSelector(state => state.face);
    const dispatch = useDispatch();
    const userClassID = profileUser.classroom._id;

    const isCamera = useRef(null);
    const [hasScanned, setScanned] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [sessionData, setSessionData] = useState(undefined);
    const [isFaceScan, setFaceScan] = useState(false);
    const [text, setText] = useState('nothing')

    useEffect(() => {
        image1.bitmap = base64ImageAvatar.base64Avatar;
        image1.type = Enum.eInputFaceType.ift_DocumentPrinted;
    }, [])

    const handleBarCodeScanned = (e) => {
        if (isLoading) return;
        setLoading(true);
        setSessionData(e.data);
    };

    const takePicture = async () => {
        if (isCamera) {
            const options = { quality: 1, base64: true, mirrorImage: true, width: 100 };
            const data = await isCamera.current.takePictureAsync(options);

            const base64Image = await RNFS.readFile(data.uri, 'base64');

            image2.bitmap = base64Image;
            image2.type = Enum.eInputFaceType.ift_DocumentPrinted;
            await matchFaces()
        }
    };

    const matchFaces = async () => {
        if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
            return
        setLoading(true);
        var request = new MatchFacesRequest()
        request.images = [image1, image2]
        Face.matchFaces(JSON.stringify(request), response => {
            response = MatchFacesResponse.fromJson(JSON.parse(response))
            var matchedFaces = response.matchedFaces
            if (matchedFaces.length > 0 ) {
                setLoading(false)
                alert(`Nhận diện khuôn mặt thành công!`);
                setFaceScan(true)
            } else {
                setLoading(false)
                alert(`Nhận diện khuôn mặt thất bại!`);
            }
        }, e => { console.log(e) })
    };

    useEffect(() => {
        let needCancel = false;
        if (isLoading && sessionData) {
            const handleScan = async () => {
                try {
                    await qrcodeApi.getById(sessionData)
                        .then(res => {
                            if (needCancel) return;
                            dispatch({ type: 'UPDATE_QRCODE', payload: res });
                            return;
                        })
                } catch (error) {
                    if (needCancel) return;
                    setScanned(true);
                    alert('Mã QR Code không hợp lệ', error)
                    dispatch({ type: 'DELETE_QRCODE' })
                } finally {
                    if (needCancel) return;
                    setLoading(false);
                    setSessionData(undefined)
                }
            }
            handleScan();
        }

        return () => {
            needCancel = true;
        }
    }, [sessionData])


    useEffect(() => {
        if (qrcodeInfo) {
            if (qrcodeInfo.isOutOfDate === false) {
                const checkScanQRCode = async () => {
                    if (qrcodeInfo.classes.includes(userClassID) === false) {
                        alert(`Mã QR code này không có lớp học của bạn!!!`);
                        setSessionData(undefined);
                        setScanned(true);
                        setLoading(false);
                        dispatch({ type: 'DELETE_QRCODE' })
                        return;
                    } else {
                        await historyApi.createOne({
                            qrcode: qrcodeInfo._id,
                            user: profileUser._id,
                        })
                            .then(() => {
                                alert(`Bạn đã điểm danh thành công!`);
                                setSessionData(undefined);
                                setScanned(true);
                                setLoading(false);
                                dispatch({ type: 'DELETE_QRCODE' });
                                return;
                            })
                            .catch((error) => {
                                alert(`Bạn đã điểm danh môn học này!!!`);
                                setSessionData(undefined);
                                setScanned(true);
                                setLoading(false);
                                dispatch({ type: 'DELETE_QRCODE' });
                                return;
                            })
                    }
                }

                checkScanQRCode();
            } else {
                setScanned(true);
                alert(`Mã QR Code đã hết hạn! `);
                dispatch({ type: 'DELETE_QRCODE' })
                return;
            }
        }
    }, [qrcodeInfo])

    return (
        <KeyboardAvoidingView style={{flex: 1}}>

        <View style={{ flex: 1 }}>
            <RNCamera
                ref={isCamera}
                style={[StyleSheet.absoluteFill]}
                type={isFaceScan ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                onBarCodeRead={hasScanned ? undefined : (e) => handleBarCodeScanned(e)}
                barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            >
                {
                    !isFaceScan ?
                    <>
                        <CircleMask />
                        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                            <View
                                style={styles.loading}
                            >
                                {isLoading ? (
                                    <Button
                                        disabled
                                        title="Scan"
                                        type="clear"
                                        loading={true}
                                        loadingProps={{ size: 'large', color: 'white' }}
                                    />
                                ) : (
                                    <View style={{ flex: 1 }}></View>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
                                <Text style={{ fontSize: 14 }}>Nhận Diện</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                        <RestangleMask />
                        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                            <View
                                style={styles.loading}
                            >
                                {isLoading ? (
                                    <Button
                                        disabled
                                        title="Scan"
                                        type="clear"
                                        loading={true}
                                        loadingProps={{ size: 'large', color: 'white' }}
                                    />
                                ) : (
                                    <View style={{ flex: 1 }}></View>
                                )}
                            </View>
                            {
                                hasScanned &&
                                <TouchableOpacity onPress={() => setScanned(false)} style={styles.capture}>
                                    <Text style={{ fontSize: 14 }}>Quét Mã</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </>

                }
            </RNCamera>
        </View>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: '3%',
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        margin: 20,
    },
    loading: {
        position: 'absolute',
        bottom: 10,
        right: 0,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default ScanScreen;
