import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image, Text } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';

const background = require('../../assets/img/bg.png');

function HomeScreen({ navigation }) {
    return (
        <View style={{flex: 1}}>
            <Image
                source={background}
                style={styles.background_img}
            />
            <View style={styles.row}>
                <View
                    style={[styles.box_shadow, styles.greenBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <Icon name="ios-scan-sharp" size={50} color="white" />
                        <Text h4 style={{color: "white"}}>
                            Scan
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={[styles.box_shadow, styles.yellowBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <Icon name="ios-qr-code-outline" size={50} color="white" />
                        <Text h4 style={{color: "white"}}>
                            Generate QRCode
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <View
                    style={[styles.box_shadow, styles.redBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <FontAwesome5 name="history" size={50} color="white" />
                        <Text h4 style={{color: "white"}}>
                            Generate History
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={[styles.box_shadow, styles.blueBg]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <Icon name="people" size={50} color="white" />
                        <Text h4 style={{color: "white"}}>
                            Attendance History
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: .35, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    flex_center: {
        flex: 1, 
        justifyContent: 'space-around', 
        alignItems: 'flex-start',
    },
    box_shadow: {
        width: '45%', 
        margin: 5,
        marginBottom: 10, 
        borderRadius: 10,
        padding: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 2,
    },
    background_img: {
        width: '100%', 
        height: 140, 
        marginBottom: 10
    },
    redBg: {
        backgroundColor: "#f3425f"
    },
    blueBg: {
        backgroundColor: "#1878f3"
    },
    greenBg: {
        backgroundColor: "#45bd63"
    },
    yellowBg: {
        backgroundColor: "#f7b928"
    }
})

export default HomeScreen;