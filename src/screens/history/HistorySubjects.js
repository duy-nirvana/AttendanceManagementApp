import moment from 'moment-timezone';
import 'moment/locale/vi'; // without this line it didn't work
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, StyleSheet, TouchableOpacity} from 'react-native';
import { ActivityIndicator, Chip, Divider, Subheading, TextInput, Title } from 'react-native-paper';
import { Text } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import slugify from 'slugify';
import historyApi from '../../api/historyApi';
import qrcodeApi from '../../api/qrcodeApi';

const fullWidth = Dimensions.get("screen").width;

const HistorySubjects = (props) => {
    const { handleOpenHistory } = props;
    const profileUser = useSelector(state => state.profile.profile);
    const [subjectsInfo, setSubjectsInfo] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoading(true);
            historyApi.getSubjects(profileUser._id)
                .then(res => {
                    setSubjectsInfo(res[0].subjects);
                    setLoading(false);
                })

        }

        fetchSubjects();
    }, [])

    const filterSubjects = (subjects) => {
        const removeMarkSearchString = slugify(searchInput, {
            replacement: ' ',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi'
        })

        return subjects && subjects.filter((subject) => {
            return slugify(subject.name, {
                replacement: ' ',
                remove: undefined,
                lower: true,
                strict: false,
                locale: 'vi'
            }).includes(removeMarkSearchString)
        })
    }

    const renderSubjects = filterSubjects(subjectsInfo);

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }} >
                <TextInput
                    placeholder="Tìm môn học"
                    mode="outlined"
                    value={searchInput}
                    theme={{ colors: { primary: 'black', underlineColor: 'transparent' } }}
                    style={{ width: '100%', backgroundColor: 'transparent'}}
                    onChangeText={(value) => setSearchInput(value)}
                />
            </View>
            <ScrollView
                style={{ marginBottom: 80 }}
            >
                {isLoading &&
                    <ActivityIndicator
                        animating={true}
                        color="#000"
                    />
                }
                {
                    renderSubjects &&
                    renderSubjects.map(subject => (
                        <View
                            key={subject._id}
                            style={{ padding: 10 }}
                        >
                            <View
                                style={[styles.box_shadow, styles.blueBg]}
                            >
                                <TouchableOpacity
                                    style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
                                >
                                    <Text h4 style={{ color: "white" }}>
                                        {subject.name}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))

                }
            </ScrollView>
        </View>
    )
}

export default HistorySubjects;

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
        height: 80,
        borderRadius: 10,

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
})