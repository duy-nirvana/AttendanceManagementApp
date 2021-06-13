import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import Face, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, Image as FaceImage } from '@regulaforensics/react-native-face-api-beta'
import * as RNFS from 'react-native-fs';
import {CircleMask} from './components/CircleMask';


import qrcodeApi from '../../api/qrcodeApi';
import historyApi from '../../api/historyApi';

var image1 = new FaceImage();
var image2 = new FaceImage();

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
    const cameraType = isFaceScan ? 'back' : 'front';

	const handleBarCodeScanned = (e) => {
        if (isLoading) return;
        setLoading(true);
        setSessionData(e.data);
    };

    const takePicture = async () => {
        if (isCamera) {
            const options = { quality: .8, base64: true, mirrorImage: true, width: 120 };
            const data = await isCamera.current.takePictureAsync(options);

            const base64Image = await RNFS.readFile(data.uri, 'base64');

            image2.bitmap = base64Image;
            image2.type = Enum.eInputFaceType.ift_Live;
            // setTakeImage(base64Image)
        }
    };

    useEffect(() => {
        let needCancel = false;
        if (isLoading && sessionData) {
            const handleScan = async () => {
                try {
                    await qrcodeApi.getById(sessionData)
                        .then(res => {
                            if (needCancel) return;
                            dispatch({type: 'UPDATE_QRCODE', payload: res });
                            return;
                        })
                } catch (error) {
                    if (needCancel) return;
                    setScanned(true);
                    alert('Mã QR Code không hợp lệ', error)
                    dispatch({type: 'DELETE_QRCODE'})
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
                        dispatch({type: 'DELETE_QRCODE'})
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
                            dispatch({type: 'DELETE_QRCODE'});
                            return;
                        })
                        .catch((error) => {
                            alert(`Bạn đã điểm danh môn học này!!!`);
                            setSessionData(undefined);
                            setScanned(true);
                            setLoading(false);
                            dispatch({type: 'DELETE_QRCODE'});
                            return;
                        })
                    }
                }

                checkScanQRCode();
            } else {
                setScanned(true);
                alert(`Mã QR Code đã hết hạn! `);
                dispatch({type: 'DELETE_QRCODE'})
                return;
            }
        }
    }, [qrcodeInfo])

    console.log({base64ImageAvatar})

	return (

		<View style={{flex: 1}}>
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
                    !isFaceScan &&
                    <>
                        <CircleMask />
                        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
                                <Text style={{ fontSize: 14 }}> SCAN </Text>
                            </TouchableOpacity>
                        </View>
                    </>

                }
            </RNCamera>

			<View
				style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
				}}>
                {isLoading ? (
                    <Button
                        disabled
                        title="Scan"
                        type="clear"
                        loading={true}
                        loadingProps={{size: 'large', color: 'white'}}
                    />
                    ) : (
                    <View style={{flex: 1}}></View>
                )}
			</View>
			{hasScanned && (
				<TouchableOpacity
				onPress={() => setScanned(false)}
				style={{
					flex: 1,
					justifyContent: 'flex-end',
					alignItems: 'center',
					marginBottom: 25,
				}}>
				<Text
					style={{
					fontSize: 20,
					backgroundColor: 'white',
					padding: 15,
					borderRadius: 30,
					}}>

					Scan Again
				</Text>
				</TouchableOpacity>
			)}
		</View>
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
        alignSelf: 'center',
        margin: 20,
	},
});

export default ScanScreen;
