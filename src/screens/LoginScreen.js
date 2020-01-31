import React from 'react';
import { View, StyleSheet, Text, Image, TextInput } from 'react-native';
import Styles from '../style/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import ApiKeys from '../../constants/ApiKeys';
import * as Google from 'expo-google-app-auth';
import { Ionicons } from '@expo/vector-icons';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

class LoginScreen extends React.Component {
    
    constructor(){
        super();
        
    }

    componentDidMount(){
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(
            function(user) {
                // console.log('AUTH STATE CHANGED CALLED');
                if(user){
                    this.props.navigation.navigate('Bottom');
                } else{
                    this.props.navigation.navigate('Login');
                }
            }.bind(this)
        )
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
              // We don't need to reauth the Firebase connection.
                return true;
                }
            }
        }
        return false;
    }

    onSignIn = googleUser => {
        // console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken);
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(error);
                // ...
            });
            } else {
                console.log('User already signed-in Firebase.');
            }
        }.bind(this));
    }

    signInWithGoogleAsync = async () => {
        try{
            const result = await Google.logInAsync({
                androidClientId: '1060042604495-gj43n1bqks2r6si16o8cg86kd8enhb4a.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });
            if(result.type === 'success'){
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch(e){
            return { error: e };
        }
    }


    state = { email: '', password: '', errorMessage: '', isFocused: false}
    
    handleLogin = () => {
        const {email, password} = this.state;
        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => this.props.navigation.navigate('Bottom'))
        .catch(error => this.setState({errorMessage: error.message}));
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
        const {navigate} = this.props.navigation;
        const { isFocused } = this.state;
        const { onFocus, onBlur, ...otherProps } = this.props;
        return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={Styles.logo}>
                    <View style={Styles.insideLogo}>
                        <Image style={{width: 38, height: 53}} source={require('../../assets/logo.png')} />
                        <Text style={{color: '#6E6161', fontSize:30}}> OJEK</Text>
                    </View>
                </View>
            </View>
            <View style={{alignItems: 'center', marginTop: 30, justifyContent:'space-around'}}>
                <Text style={styles.title}>Login</Text>
                <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
                
                {/* <TextInput 
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize={"none"}
                selectionColor={BLUE}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                underlineColorAndroid={
                    isFocused ? BLUE : LIGHT_GRAY
                }
                style={Styles.textField}
                onChangeText={email => this.setState({email})}
                value={this.state.email}>
                </TextInput>
                
                <TextInput 
                placeholder="Password"
                selectionColor={BLUE}
                secureTextEntry= {true}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                underlineColorAndroid={
                    isFocused ? BLUE : LIGHT_GRAY
                }
                style={Styles.textField}
                onChangeText={password => this.setState({password})}
                value={this.state.password}>
                </TextInput> */}
                <TouchableOpacity style={styles.button} onPress={this.signInWithGoogleAsync}>
                    <View style={{backgroundColor: 'white', flex: 2, alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        <Image source={require('../../assets/google_logo.png')} style={{height: 30, width: 30}} />
                    </View>
                    <View style={{alignItems:'center', flex: 4, paddingHorizontal:10}}>
                        <Text style={{color: 'white', fontSize: 18}}>Masuk dengan Google</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        );
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
        backgroundColor: "#4285F4",
        width: 200,
        height: 60,
        flexDirection: 'row'
    }
});

export default LoginScreen;