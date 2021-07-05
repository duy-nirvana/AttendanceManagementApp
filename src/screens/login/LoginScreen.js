import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import authApi from '../../api/authApi';

const Logo = require('../../assets/img/logo-app.png');

const statusBarHeight = StatusBar.currentHeight;
const fullWidth = Dimensions.get('screen').width; //full width

const LoginScreen = (props) => {
    const dispatch = useDispatch();
    const [codeNumberValue, setCodeNumber] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [valueForm, setValueForm] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isHidePass, setHidePass] = useState(true);

    useEffect(() => {
        setValueForm((prevState) => ({
            ...prevState,
            codeNumber: codeNumberValue,
            password: passwordValue
        }))

    }, [codeNumberValue, passwordValue])

    const handleChangeErrorsToString = (errors) => {
        let errorsString = "";
        errors.errors.map((err) => {
            errorsString += `${err.msg} \n`
        })
        return errorsString;
    }

    const handleOnPress = async () => {
        try {
            setLoading(true);
            await authApi.login(valueForm)
            .then((res) => {
                setLoading(false);
                AsyncStorage.setItem('userToken', res.token);
                dispatch({ type: 'SIGN_IN', token: res.token });
            })
            .catch(err => {
                setLoading(false);
                const errors = JSON.parse(err.response.request._response);
                Toast.show(`${handleChangeErrorsToString(errors)}`, Toast.LONG);
            });
        } catch (error) {
            console.log('Fail to login', error);
        }
    }

    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: 'center', backgroundColor: '#9FD8DF'}}>
            <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                <Image source={ Logo } style={{width: 150, height: 150, marginBottom: 20}}/>
                <TextInput
                    label="MSSV"
                    mode="outlined"
                    value={codeNumberValue}
                    onChangeText={(value) => setCodeNumber(value)}
                    theme={{ colors: { primary: 'black',underlineColor:'transparent' }}}
                    style={{width: fullWidth * 0.9, marginBottom: 15}}
                />
                <TextInput
                    label="Mật Khẩu"
                    mode="outlined"
                    secureTextEntry={isHidePass ? true : false}
                    value={passwordValue}
                    onChangeText={(value) => setPasswordValue(value)}
                    theme={{ colors: { primary: 'black',underlineColor:'transparent' }}}
                    style={{width: fullWidth * 0.9, marginBottom: 15}}
                    right={
                    <TextInput.Icon
                        onPress={() => setHidePass(!isHidePass)}
                        name={isHidePass ? 'eye-off' : 'eye'} />}
                />
                <Button
                    mode="outlined"
                    color="white"
                    loading={isLoading}
                    style={{width: fullWidth * .9,  backgroundColor: '#235789', padding: 10}}
                    onPress={handleOnPress}

                >
                    ĐĂNG NHẬP
                </Button>

            </View>
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
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
    },
    orangeBg: {
        backgroundColor: "#EF6306"
    },
    violetBg: {
        backgroundColor: "#541388"
    },
})