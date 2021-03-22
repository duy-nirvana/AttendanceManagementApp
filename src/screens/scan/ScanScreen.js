import * as React from 'react';
import { Text, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';

function ScanScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Scan screen hehehhe</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details')}
            />
            <CheckBox
                title='Click Here'
                checked={true}
            />
        </View>
    );
}

export default ScanScreen;