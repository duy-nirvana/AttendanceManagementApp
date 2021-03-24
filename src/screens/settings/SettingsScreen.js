import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Image, Text, Avatar, Input, Button } from 'react-native-elements';

const background = require('../../assets/img/bg.png');
const avatar = require('../../assets/img/alien.png')

function SettingsScreen({ navigation }) {
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

          <View style={styles.align_center}>
            <Avatar
              size="xlarge"
              rounded
              source={avatar}
              avatarStyle={{
                borderWidth: 1, borderColor: '#ccc'
              }}
            />
          </View>

          <Input
            disabled
            label="Tên"
            value='Trần Khánh Duy'
            containerStyle={{
              marginTop: 5
            }}
            labelStyle={{
              color: "black"
            }}
          />
          <Input
            disabled
            label="MSSV"
            value='1711062181'
            containerStyle={{
              marginTop: 5,
            }}
            labelStyle={{
              color: "black"
            }}
          />
          <Input
            disabled
            label="Lớp"
            value='17DTHC5'
            containerStyle={{
              marginTop: 5
            }}
            labelStyle={{
              color: "black"
            }}
          />
          <Input
            disabled
            label="Email"
            value='trankhanhduy8599@gmail.com'
            containerStyle={{
              marginTop: 5
            }}
            labelStyle={{
              color: "black"
            }}
          />
          <Button
            title="ĐỔI MẬT KHẨU"
            titleStyle={{
              fontSize: 20,
            }}
            buttonStyle={[{
              marginTop: 10,
              padding: 20
            }, styles.yellowBg ]}
          />
          <Button
            title="ĐĂNG XUẤT"
            titleStyle={{
              fontSize: 20,
            }}
            buttonStyle={[{
              marginTop: 10,
              marginBottom: 30,
              padding: 20
            }, styles.redBg]}
          />
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
        height: 120, 
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