import Face, { Enum, Image as FaceImage, MatchFacesRequest, MatchFacesResponse } from '@regulaforensics/react-native-face-api-beta';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-elements';
import * as RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import historyApi from '../../../api/historyApi';
import { CircleMask } from '../../scan/components/Mask';


let image1 = new FaceImage();
let image2 = new FaceImage();

const FaceScanScreen = ({ route: { params }, navigation }) => {
    const { qrcode, user } = params;
    const base64ImageAvatar = useSelector(state => state.face);
    const isCamera = useRef(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        image1.bitmap = base64ImageAvatar.base64Avatar;
        image1.type = Enum.eInputFaceType.ift_DocumentPrinted;
    }, [])

    const takePicture = async () => {
        if (isCamera) {
            const options = { quality: 1, base64: true, mirrorImage: true, width: 200 };
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
            if (matchedFaces.length > 0) {
                setLoading(false)
                historyApi.createOne({
                    qrcode,
                    user,
                }).then(() => {
                    Alert.alert(
                        "",
                        "Bạn đã điểm danh thành công",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate("Home")
                            },
                        ],
                        { cancelable: false }
                    );
                })
            } else {
                setLoading(false)
                alert(`Nhận diện khuôn mặt thất bại!`);
            }
        }, e => { console.log(e) })
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>
                <RNCamera
                    ref={isCamera}
                    style={[StyleSheet.absoluteFill]}
                    type={RNCamera.Constants.Type.front}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                >
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

export default FaceScanScreen;
