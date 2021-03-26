import React, { PureComponent, useState } from 'react';
import { Button } from 'react-native';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

const ScanScreen = () => {
  const [hasScan, setScan] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
   
  const scanAgain = () => {
    //  eslint-disable-next-line
    setScan(false);
  }

  const handleBarCodeScanned = (e) => {
    console.log('press', e.data);
    setScan(true);
  }

  console.log(flashMode)
  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={flashMode ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off }
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={hasScan ? undefined : (e) => handleBarCodeScanned(e)}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      >
        
        <Button title="LIGHT" onPress={() => setFlashMode(!flashMode)}></Button>
        {
          hasScan &&
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => scanAgain()} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> Scan Again </Text>
            </TouchableOpacity>
          </View>
        }
      </RNCamera>
    </View>
  );
}

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

export default ScanScreen;