import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-elements';
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
                    style={styles.box_shadow}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <Icon name="ios-scan-sharp" size={50} color="black" />
                        <Text>
                            Scan
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={styles.box_shadow}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <Icon name="ios-qr-code-outline" size={50} color="black" />
                        <Text>
                            Generate QRCode
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row}>
                <View
                    style={styles.box_shadow}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <FontAwesome5 name="history" size={50} color="black" />
                        <Text>
                            Generate History
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.box_shadow}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Scan')}
                        style={styles.flex_center}
                    >
                        <Icon name="people" size={50} color="black" />
                        <Text>
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
        flex: .3, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    flex_center: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    box_shadow: {
        width: '40%', 
        margin: 5, 
        backgroundColor: "white",
        borderRadius: 15,

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
    }
})

export default HomeScreen;