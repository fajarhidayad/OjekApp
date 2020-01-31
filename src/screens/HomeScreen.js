import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Styles from '../style/style';
import * as firebase from 'firebase';
import ApiKeys from '../../constants/ApiKeys';

class HomeScreen extends React.Component {
    
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate( user ? 'Bottom' : 'Home');
        });
    }

    render(){
    return <View style={styles.container}>
        <View style={Styles.logo}>
            <View style={Styles.insideLogo}>
                <Image style={{width: 38, height: 53}} source={require('../../assets/logo.png')} />
                <Text style={{color: '#6E6161', fontSize:30}}> OJEK</Text>
            </View>
        </View>
        <View>
            <Text style={{fontSize: 30, color: 'white'}}>Selamat Datang</Text>
        </View>
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Login')}>
                <Text>Masuk</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 15, color: 'white', marginVertical: 15}}>Belum Punya Akun ?</Text>
            <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Signup')}>
                <Text>Daftar</Text>
            </TouchableOpacity>
        </View>
    </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDCB6E',
        alignItems: 'center',
        justifyContent:"space-around"
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: 208,
        height: 54,
        borderRadius: 18
    }

});

export default HomeScreen;