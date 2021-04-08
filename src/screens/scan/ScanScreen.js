import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import qrcodeApi from '../../api/qrcodeApi';
import historyApi from '../../api/historyApi';

const ScanScreen = () => {
	const qrcodeInfo = useSelector(state => state.qrcode.qrcode);
	const profileUser = useSelector(state => state.profile.profile);
	const dispatch = useDispatch();
	const userClassID = profileUser.classroom._id;

    const [hasScanned, setScanned] = useState(false);
	const [isLoading, setLoading] = useState(false);
    const [sessionData, setSessionData] = useState(undefined);

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
				justifyContent: 'space-between',
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
					fontSize: 14,
					backgroundColor: 'white',
					padding: 10,
					borderRadius: 10,
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
		flex: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	capture: {
		backgroundColor: 'white',
		padding: 10,
		alignSelf: 'flex-end',
		justifyContent: 'center',
	},
});

export default ScanScreen;
