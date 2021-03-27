import React, { PureComponent, useState } from 'react';
import { Button } from 'react-native-elements';
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
   
  const scanAgain = () => {
    //  eslint-disable-next-line
    setScan(false);
  }

  const handleBarCodeScanned = (e) => {
    console.log(e.data);
    setScan(true);
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={hasScan ? undefined : (e) => handleBarCodeScanned(e)}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      >
          {/* <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <Button title="Scan" onPress={() => scanAgain()} style={{flex: 1}} />
          </View> */}
        
      </RNCamera>

        {/* <Button title="Light" onPress={() => setFlashMode(!flashMode)}></Button> */}
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        <Button disabled title="Scan" type="clear" loading={true} loadingProps={{size: 'large', color: 'white'}} />
      </View>


        {/* <Button title="LIGHT" onPress={() => setFlashMode(!flashMode)}></Button>
        {
          hasScan &&
          <View style={{ flex: 1}}>
            <TouchableOpacity onPress={() => scanAgain()} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> Scan Again </Text>
            </TouchableOpacity>
          </View>
        } */}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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