import React, { useEffect, useState } from 'react';
import { View, Modal, ScrollView, Dimensions, StatusBar, Alert, ImageBackground, StyleSheet, LogBox} from 'react-native';
import {TextInput, Button, Headline, Title} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdatePassword from './components/UpdatePassword';
import { Image, Text, Avatar } from 'react-native-elements';

const background = require('../../assets/img/bg.png');

const fullWidth = Dimensions.get('screen').width; //full width
const statusBarHeight = StatusBar.currentHeight;

function SettingsScreen(props) {
    const [hasOpenChangePassword, setOpenChangePassword] = useState(false);
    const profileUser = useSelector(state => state.profile.profile);
    const dispatch = useDispatch();

    const handleOpenChangePassword = (status) => {
        setOpenChangePassword(status);
    }

    const verifySignOut = () => {
        Alert.alert(
            "",
            "Bạn chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy"
                },
                {
                    text: "OK",
                    onPress: () => handleSignOut()
                },
            ],
            { cancelable: false }
        );
    }

    const handleSignOut = () => {
        dispatch({ type: 'SIGN_OUT' });
        AsyncStorage.removeItem('userToken');
    } 

    return (
      <View style={{flex: 1}}>
        <Image
          source={background}
          style={[styles.background_img, styles.justify_center]}>
          <Text h1 style={{color: 'white'}}>
            Settings
          </Text>
        </Image>
        
        <ScrollView style={{padding: 12}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
                    <Avatar
                        rounded
                        size="xlarge"
                        source={{
                            uri: `${profileUser.avatar}`,
                        }}
                    />
                </View>
                <TextInput
                    style={{  backgroundColor: 'white', marginTop: 10}}
                    label="HỌ VÀ TÊN"
                    value={profileUser.fullName}
                    editable={false}
                />
                <TextInput
                    style={{  backgroundColor: 'white', marginTop: 10}}
                    label={profileUser.roles === 'user' ? "MSSV" : "MSGV"}
                    value={profileUser.codeNumber}
                    editable={false}
                />
                {
                    profileUser.roles === 'user'
                    &&
                    <TextInput
                        style={{  backgroundColor: 'white', marginTop: 10}}
                        label="LỚP"
                        value={profileUser.classroom.name}
                        editable={false}
                    />
                }
                <TextInput
                    style={{  backgroundColor: 'white', marginTop: 10}}
                    label="SĐT"
                    value={profileUser.phone}
                    editable={false}
                />
                <TextInput
                    style={{  backgroundColor: 'white', marginTop: 10}}
                    label="EMAIL"
                    value={profileUser.email}
                    editable={false}
                />
                <Button 
                    mode="outlined" 
                    color="white" 
                    style={[{padding: 20, marginTop: 10}, styles.yellowBg]}
                    onPress={() => handleOpenChangePassword(true)}
                > 
                    ĐỔI MẬT KHẨU
                </Button>
                <Button 
                    mode="outlined" 
                    color="white" 
                    style={[{padding: 20, marginTop: 10, marginBottom: 20}, styles.redBg]}
                    onPress={verifySignOut}
                > 
                    ĐĂNG XUẤT
                </Button>
                <Modal
                    animationType="slide"
                    visible={hasOpenChangePassword}
                >   
                    <UpdatePassword 
                        handleOpenChangePassword={handleOpenChangePassword}
                        handleSignOut={handleSignOut}
                    />
                </Modal>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: .35, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    flex_left: {
        flex: 1, 
        justifyContent: 'space-around', 
        alignItems: 'flex-start',
    },
    justify_center: {
        justifyContent: "center"
    },
    align_center: {
        alignItems: "center"
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
        height: 100, 
        marginBottom: 10,
        padding: 15
    },
    redBg: {
        backgroundColor: "#f3425f"
    },
    yellowBg: {
        backgroundColor: "#f7b928"
    }
})

export default SettingsScreen;