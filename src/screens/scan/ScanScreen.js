import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import qrcodeApi from '../../api/qrcodeApi';
import historyApi from '../../api/historyApi';

const PendingView = () => (
<View
	style={{
		flex: 1,
		backgroundColor: 'lightgreen',
		justifyContent: 'center',
		alignItems: 'center',
	}}>
	<Text>Waiting</Text>
</View>
);

const ScanScreen = () => {
	const qrcodeInfo = useSelector(state => state.qrcode.qrcode);
	const profileUser = useSelector(state => state.profile.profile);
	const dispatch = useDispatch();
	const userClassID = profileUser.classroom._id;

	const [hasScan, setScan] = useState(false);
	const [historyInfo, setHistoryInfo] = useState({});
	const [isLoading, setLoading] = useState(false);

	const handleBarCodeScanned = e => {
		const handleScan = async () => {
			try {
				setLoading(true);
				const qrcodeValue = await qrcodeApi.getById(e.data) 
				setLoading(false);
				dispatch({type: 'UPDATE_QRCODE', payload: qrcodeValue});
			} catch (error) {
				setLoading(false);
				setScan(true);
				alert('Mã QR Code không hợp lệ', error);
				dispatch({type: 'DELETE_QRCODE'});
			}
		};

		handleScan();
	};

	useEffect(() => {
		if (qrcodeInfo) {
		if (qrcodeInfo.isOutOfDate === false) {
			const checkScanQRCode = () => {
			if (qrcodeInfo.classes.includes(userClassID) === false) {
				setLoading(false);
				setScan(true);
				alert(`Mã QR code này không có lớp học của bạn!!!`);
				dispatch({type: 'DELETE_QRCODE'});
				return;
			} else {
				historyApi
				.createOne({
					qrcode: qrcodeInfo._id,
					user: profileUser._id,
				})
				.then(() => {
					setLoading(false);
					setScan(true);
					alert(`Bạn đã điểm danh thành công!`);
					dispatch({type: 'DELETE_QRCODE'});
					return;
				})
				.catch(error => {
					setLoading(false);
					setScan(true);
					alert(`Bạn đã điểm danh môn học này!!!`);
					dispatch({type: 'DELETE_QRCODE'});
					return;
				});
			}
			};

			checkScanQRCode();
		} else {
			setLoading(false);
			setScan(true);
			dispatch({type: 'DELETE_QRCODE'});
			return alert(`Mã QR Code đã hết hạn! `);
		}
		}
	}, [qrcodeInfo]);

	return (
		// <View style={styles.container}>
		//   <RNCamera
		//     style={{flex: 1}}
		//     type={RNCamera.Constants.Type.back}
		//     androidCameraPermissionOptions={{
		//       title: 'Permission to use camera',
		//       message: 'We need your permission to use your camera',
		//       buttonPositive: 'Ok',
		//       buttonNegative: 'Cancel',
		//     }}
		//     onBarCodeRead={hasScan ? undefined : (e) => handleBarCodeScanned(e)}
		//     barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
		//   >
		//       {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
		//         <Button title="Scan" onPress={() => scanAgain()} style={{flex: 1}} />
		//       </View> */}

		//   </RNCamera>

		//     {/* <Button title="Light" onPress={() => setFlashMode(!flashMode)}></Button> */}
		//   <View style={{flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
		//     <Button disabled title="Scan" type="clear" loading={true} loadingProps={{size: 'large', color: 'white'}} />
		//   </View>

		//     <TouchableOpacity onPress={() => scanAgain()} style={styles.capture}>
		//       <Text style={{ fontSize: 14 }}> Scan Again </Text>
		//     </TouchableOpacity>

		//     {/* {/* <Button title="LIGHT" onPress={() => setFlashMode(!flashMode)}></Button> */}
		//     {
		//       hasScan &&
		//       <View style={{ flex: 1}}>
		//         <TouchableOpacity onPress={() => scanAgain()} style={styles.capture}>
		//           <Text style={{ fontSize: 14 }}> Scan Again </Text>
		//         </TouchableOpacity>
		//       </View>
		//     }

		// </View>
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
				onBarCodeRead={hasScan ? undefined : e => handleBarCodeScanned(e)}
				barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}></RNCamera>

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
			{hasScan && (
				<TouchableOpacity
				onPress={() => setScan(false)}
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
					{' '}
					Scan Again{' '}
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
