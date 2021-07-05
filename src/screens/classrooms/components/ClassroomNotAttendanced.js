import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ActivityIndicator, Chip, Subheading } from 'react-native-paper';
import userApi from '../../../api/userApi';

const ClassroomNotAttendanced = ({ classes, usersAttendance, setNotAttendanceLength }) => {
    const [isLoading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersNotAttendance, setUsersNotAttendance] = useState([]);

    useEffect(() => {
        const getUserByClasses = async () => {
            try {
                const res = await userApi.getByClasses({ classes });
                setUsers(res);
            } catch (error) {
                console.log('can not get users');
            };
        }

        getUserByClasses();
    }, [])

    useEffect(() => {
        const filterNotAttendanceUsers = async () => {
            // if (usersAttendance.length === 0) return;
            const usersAttendanceIDs = await usersAttendance.map(user => user.user._id);

            const filterUserNotAtteandance = users.filter(user => {
                return usersAttendanceIDs.indexOf(user._id) === -1 && user.roles !== 'moderator';
            })

            setUsersNotAttendance(filterUserNotAtteandance);
            setNotAttendanceLength(usersNotAttendance.length);
        }

        filterNotAttendanceUsers();
    }, [usersAttendance])

    const renderItem = ({ item }) => {

        return (
            <View
                style={{ padding: 10 }}
            >
                <Text h4>{item.fullName}</Text>
                <Text>MSSV: {item.codeNumber}</Text>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Lớp </Text>
                    <Chip
                        key={item._id}
                        style={[styles.orangeBg, { marginRight: 5, marginTop: 5 }]}
                    >
                        <Subheading style={{ color: '#fff' }}>{item.classroom.name}</Subheading>
                    </Chip>
                </View>

            </View>
        );
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>

                {
                    usersNotAttendance.length !== 0 ?
                        <FlatList
                            data={usersNotAttendance}
                            renderItem={renderItem}
                            keyExtractor={(user) => user._id}
                        />
                        :
                        <ActivityIndicator
                            animating={true}
                            color="#000"
                        />
                }
            </SafeAreaView>
        </>
    )
};

export default ClassroomNotAttendanced;

const styles = StyleSheet.create({
    row: {
        flex: .30,
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
    box_shadow: {
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        padding: 20,

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
})