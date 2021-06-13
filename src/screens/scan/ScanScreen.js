import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import Face, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, Image as FaceImage } from '@regulaforensics/react-native-face-api-beta'

import qrcodeApi from '../../api/qrcodeApi';
import historyApi from '../../api/historyApi';

var image1 = new FaceImage();
var image2 = new FaceImage();

const ScanScreen = () => {
	const qrcodeInfo = useSelector(state => state.qrcode.qrcode);
	const profileUser = useSelector(state => state.profile.profile);
	const dispatch = useDispatch();
	const userClassID = profileUser.classroom._id;

    const [hasScanned, setScanned] = useState(false);
	const [isLoading, setLoading] = useState(false);
    const [sessionData, setSessionData] = useState(undefined);
    const [isFaceScan, setFaceScan] = useState(false);
    const [base64Avatar, setBase64Avatar] = useState(null);

	const handleBarCodeScanned = (e) => {
        if (isLoading) return;
        setLoading(true);
        setSessionData(e.data);
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
        const getFaceAvatar = async () => {
            const faceImage =
            await axios
                .get(profileUser.avatar, { responseType: 'arraybuffer' })
                .then(response => Buffer.from(response.data, 'binary').toString('base64'))

            setBase64Avatar(faceImage);
        }

        getFaceAvatar();
    }, [])

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

	return (

		<View style={{flex: 1}}>
			<RNCamera
				style={[StyleSheet.absoluteFill]}
				type={RNCamera.Constants.Type.back}
				androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
				}}
				onBarCodeRead={hasScanned ? undefined : (e) => handleBarCodeScanned(e)}
				barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            />

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
