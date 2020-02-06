import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Styles from '../style/style';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

class AkunSettings extends React.Component{
    render(){
        return <View style={Styles.container}>
            <View style={Styles.header}>
                <View style={Styles.insideLogo}>
                    <Image style={{width: 18, height: 33}} source={require('../../assets/logo-putih.png')} />
                    <Text style={{color: 'white', fontSize:20}}> OJEK</Text>
                </View>
            </View>
        </View>
    }
}

export default AkunSettings;