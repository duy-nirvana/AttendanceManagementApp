import React, { PureComponent } from 'react';
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

class ScanScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {hasScanned: false};
  }
  render() {
  
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onBarCodeRead={this.state.hasScanned ? undefined : (e) => this.handleBarCodeScanned(e)}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        >
          {({ camera, status }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => this.scanAgain(camera)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> Scan Again </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }

  scanAgain = function(camera) {
    // const options = { quality: 0.5, base64: true };
    // const data = await camera.takePictureAsync(options);
    // //  eslint-disable-next-line
    // console.log(data.uri);
    this.setState({hasScanned: false});
  };

  handleBarCodeScanned = (e) => {
    console.log('press', e.data)
    this.setState({hasScanned: true});
  }
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