import React, { useEffect, useState, PureComponent, useRef } from 'react';
import * as RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import { Buffer } from "buffer";
import Face, { Enum, FaceCaptureResponse, LivenessResponse, MatchFacesResponse, MatchFacesRequest, Image as FaceImage } from '@regulaforensics/react-native-face-api-beta'
import ImageEditor from "@react-native-community/image-editor";
import { Dimensions } from 'react-native';

var image1 = new FaceImage()
var image2 = new FaceImage()

const FaceScanScreen = () => {
    const isCamera = useRef(null);
    const profileUser = useSelector(state => state.profile.profile);
    const [isLoading, setLoading] = useState('nothing');
    const [takeImage, setTakeImage] = useState('');

    const takePicture = async () => {
        if (isCamera) {
          const options = { quality: .8, base64: true, fixOrientation: true, mirrorImage: true, width: 120};
          const data = await isCamera.current.takePictureAsync(options);

          //---------------------
          const base64Image = await RNFS.readFile(data.uri, 'base64');

          //   console.log({image2})


          // crop image
            // let cropData = {
            //   offset: {x: 10, y: 10},
            //   size: {width: 200, height: 200},
            // };

            // let result = await ImageEditor.cropImage(data.uri, cropData)
            // let finalData = await RNFS.readFile(result, 'base64');
            image2.bitmap = base64Image;
            image2.type = Enum.eInputFaceType.ift_Live;
            setTakeImage(base64Image)
        }
    };


    const getFace1 = async () => {
        const res =
        await axios
            .get(profileUser.avatar, {responseType: 'arraybuffer'})
            .then(response => Buffer.from(response.data, 'binary').toString('base64'))

        image1.bitmap = res;
        image1.type = Enum.eInputFaceType.ift_DocumentPrinted;
        console.log({image1})
    }

    const matchFaces = async () => {
        if (image1 == null || image1.bitmap == null || image1.bitmap == "" || image2 == null || image2.bitmap == null || image2.bitmap == "")
          return
        setLoading('Loading...');
        var request = new MatchFacesRequest()
        request.images = [image1, image2]
        Face.matchFaces(JSON.stringify(request), response => {
          response = MatchFacesResponse.fromJson(JSON.parse(response))
          var matchedFaces = response.matchedFaces
          setLoading(matchedFaces.length > 0 ? ((matchedFaces[0].similarity * 100).toFixed(2) + "%") : "error" )
        }, e => { setLoading(e) })
      }

    return (
        <View style={{flex: 1}}>
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
            />

            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => getFace1()} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> GET </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => matchFaces()} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> MATCH </Text>
                </TouchableOpacity>

            </View>
                <Image
                    source={{uri: `data:image/png;base64,${takeImage}`}}
                    style={{
                        width: 100,
                        height: 110
                    }}
                />
                <Text>{isLoading}</Text>
		</View>
    )
}

export default FaceScanScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
});