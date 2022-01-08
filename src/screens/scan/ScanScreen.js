import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Face, { Enum, MatchFacesResponse, MatchFacesRequest, Image as FaceImage } from '@regulaforensics/react-native-face-api-beta'
import * as RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import { CircleMask, RestangleMask } from './components/Mask';
import Icon from 'react-native-vector-icons/Ionicons';

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
    // const [qrcodeInfo, setQRCodeInfo] = useState(null)
    const [hasScanned, setScanned] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [sessionData, setSessionData] = useState(undefined);
    const [isFaceScan, setFaceScan] = useState(true);
    const [text, setText] = useState('nothing')
    
    const [cameraPosition, setCameraPosition] = useState(true);

    useEffect(() => {
        image1.bitmap = base64ImageAvatar.base64Avatar;
        image1.imageType = Enum.eInputFaceType.ift_DocumentPrinted;
    }, [])

    const handleReverseCamera = () => {
        setCameraPosition(!cameraPosition);
    }

    const handleBarCodeScanned = (e) => {
        if (isLoading) return;
        setLoading(true);
        setSessionData(e.data);
    };

    const takePicture = async () => {
        if (isCamera) {
            const options = { quality: 1, base64: true,  width: 400 };
            const data = await isCamera.current.takePictureAsync(options);

            const base64Image = await RNFS.readFile(data.uri, 'base64');
            console.log(base64Image)

            image2.bitmap = base64Image;
            image2.imageType = Enum.eInputFaceType.ift_DocumentPrinted;
            matchFaces()
        }
    };


    const matchFaces = () => {
        if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
        return
        // console.log({image1})
        // console.log({image2})
        setLoading(true);
        var request = new MatchFacesRequest()
        request.images = [image1, image2]
        Face.matchFaces(JSON.stringify(request), response => {
            response = MatchFacesResponse.fromJson(JSON.parse(response))
            var matchedFaces = response.matchedFaces
            if (matchedFaces.length > 0 ) {
                setLoading(false)
                // alert(`Nhận diện khuôn mặt thành công!`);
                setFaceScan(false)
                setCameraPosition(false);
            } else {
                setLoading(false)
                alert(`Nhận diện khuôn mặt thất bại!`);
            }
        }, e => { console.log(e) })

        // if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
        //     return
        // setText('loading ...')
        // var request = new MatchFacesRequest()
        // request.images = [image1, image2]
        // Face.matchFaces(JSON.stringify(request), response => {
        //     response = MatchFacesResponse.fromJson(JSON.parse(response))
        //     var matchedFaces = response.matchedFaces
        //     console.log({ response })
        //     setText( matchedFaces.length > 0 ? ((matchedFaces[0].similarity * 100).toFixed(2) + "%") : "error" )
        // }, e => setText(e) )
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
                            // setQRCodeInfo(res)
                            return;
                        })
                } catch (error) {
                    if (needCancel) return;
                    setScanned(true);
                    alert('Mã QR Code không hợp lệ', error)
                    dispatch({ type: 'DELETE_QRCODE' })
                    // setQRCodeInfo(null)
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
                    const compareClass = await qrcodeInfo?.classes?.find(classesID => {
                        console.log('class ID:', classesID._id)
                        return classesID._id === userClassID
                    })
                    console.log('QRCOEDE INFOOOO:', qrcodeInfo);
                    console.log('user class id:', userClassID);
                    console.log({compareClass});
                    if (!compareClass) {
                        alert(`Mã QR code này không có lớp học của bạn!!!`);
                        setSessionData(undefined);
                        setScanned(true);
                        setLoading(false);
                        dispatch({type: 'DELETE_QRCODE'})
                        // setQRCodeInfo(null)
                        return;
                    } else {
                        await historyApi.createOne({
                            qrcode: sessionData,
                            owner: profileUser._id,
                        })
                        .then(() => {
                            alert(`Bạn đã điểm danh thành công!`);
                            setSessionData(undefined);
                            setScanned(true);
                            setLoading(false);
                            dispatch({type: 'DELETE_QRCODE'});
                            // setQRCodeInfo(null)
                            return;
                        })
                        .catch((error) => {
                            alert(`Bạn đã điểm danh môn học này!!!`);
                            setSessionData(undefined);
                            setScanned(true);
                            setLoading(false);
                            dispatch({type: 'DELETE_QRCODE'});
                            // setQRCodeInfo(null)
                            return;
                        })
                    }
                }

                checkScanQRCode();
            } else {
                setScanned(true);
                alert(`Mã QR Code đã hết hạn! `);
                dispatch({type: 'DELETE_QRCODE'})
                // setQRCodeInfo(null)
                return;
            }
        }
    }, [qrcodeInfo])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                <RNCamera
                    ref={isCamera}
                    style={[StyleSheet.absoluteFill]}
                    type={(cameraPosition) ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
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
                        isFaceScan ?
                            <>
                                <CircleMask />
                                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                    <Icon onPress={() => handleReverseCamera()} name="camera-reverse-outline" style={styles.cameraReverse} size={40} color="white" />
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
    cameraReverse: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        borderRadius: 5,
        paddingHorizontal: 20,
    },
});

export default ScanScreen;
