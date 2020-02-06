import React from 'react';
import { View, StyleSheet, Text, Image, TextInput } from 'react-native';
import Styles from '../style/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ApiKeys from '../../constants/ApiKeys';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";
const ref = firebase.firestore().collection('UsersOjek');

class SignupScreen extends React.Component {
    constructor(){
        super();
    }

    state = {
        isFocused: false,
        nama: '',
        email: '',
        password: '',
        telepon: '',
        errorMessage: null
    };



    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((res) => {
                firebase.database().ref('users/' + res.user.uid).set({
                    nama: this.state.nama,
                    telepon: this.state.telepon
                })
                this.props.navigation.navigate('Bottom')})
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    
    handleFocus = event => {
        this.setState({ isFocused: true });
        if(this.props.onFocus){
            this.props.onFocus(event);
        }
    };

    handleBlur = event => {
        this.setState({ isFocused: false });
        if(this.props.onBlur){
            this.props.onBlur(event);
        }
    }

    render(){
        const { isFocused } = this.state;
        const { onFocus, onBlur, ...otherProps } = this.props;
        return <View style={styles.container}>
            <View style={styles.header}>
                <View style={Styles.logo}>
                    <View style={Styles.insideLogo}>
                        <Image style={{width: 38, height: 53}} source={require('../../assets/logo.png')} />
                        <Text style={{color: '#6E6161', fontSize:30}}> OJEK</Text>
                    </View>
                </View>
            </View>
            <View style={{alignItems: 'center', marginTop: 30, justifyContent:'space-around'}}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={{color:'red'}}>{this.state.errorMessage}</Text>
                <TextInput 
                placeholder="Nama Lengkap"
                selectionColor={BLUE}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                underlineColorAndroid={
                    isFocused ? BLUE : LIGHT_GRAY
                }
                style={Styles.textField}
                onChangeText={nama => this.setState({ nama })}
                value={this.state.nama}>
                </TextInput>
                
                <TextInput 
                placeholder="E-mail"
                selectionColor={BLUE}
                autoCapitalize="none"
                autoCompleteType='email'
                keyboardType='email-address'
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                underlineColorAndroid={
                    isFocused ? BLUE : LIGHT_GRAY
                }
                style={Styles.textField}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}>
                </TextInput>

                <TextInput 
                placeholder="Telepon"
                selectionColor={BLUE}
                autoCapitalize="none"
                keyboardType='phone-pad'
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                underlineColorAndroid={
                    isFocused ? BLUE : LIGHT_GRAY
                }
                style={Styles.textField}
                onChangeText={telepon => this.setState({ telepon })}
                value={this.state.telepon}>
                </TextInput>
                
                <TextInput 
                placeholder="Password"
                selectionColor={BLUE}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                secureTextEntry={true}
                underlineColorAndroid={
                    isFocused ? BLUE : LIGHT_GRAY
                }
                style={Styles.textField}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}>
                </TextInput>
                <TouchableOpacity style={styles.button}
                onPress={this.handleSignUp}
                >
                    <Text style={{color: 'white', fontSize: 20}}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>;
    }
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        flexDirection: 'row',
        height: 250,
        backgroundColor: "#FDCB6E",
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        fontSize:25,
    },
    button:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        backgroundColor: "#FDCB6E",
        width: 200,
        height: 60,
        borderRadius: 27
    }
});

export default SignupScreen;