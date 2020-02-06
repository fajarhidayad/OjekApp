import React from 'react';
import { Text, View, TouchableOpacity, Image, BackHandler, ScrollView, KeyboardAvoidingView, YellowBox } from 'react-native';
import Styles from '../style/style';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { GiftedChat } from 'react-native-gifted-chat';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Warning: componentWillMount']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Warning: componentWillMount') <= -1) {
        _console.warn(message);
    }
};

export default class ChatScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: {},
            driver: '',
            messages: [],
        }
    }

    getData = () => {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('Pesanan/Diterima/'+uid).once('value', (snapshot) => {
            let data = snapshot.val();
            this.setState({
                data: data,
                driver: data.namaDriver,
            });
        });
    }

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user,
            };
            this.db.push(message);
        });
    };

    get user(){
        return{
            _id:this.uid,
            name:firebase.auth().currentUser.displayName,
        }
    }

    parse = message => {
        const { user, text, timestamp } = message.val();
        const { key: _id} = message;
        const createdAt = new Date(timestamp);
        
        return{
            _id,
            createdAt,
            text,
            user
        };
    };

    get = callback => {
        this.db.on('child_added',snapshot => callback(this.parse(snapshot)));
    }

    off() {
        this.db.off()
    }

    get db() {
        return firebase.database().ref('Pesanan/Diterima/'+firebase.auth().currentUser.uid+'/chat');
    }

    get uid(){
        return (firebase.auth().currentUser || {} ).uid;
    }
    
    handleBackPress = () => {
        this.props.navigation.navigate('OrderOjek');
        return true;
    }

    componentDidMount(){
        this.getData();
        this.get(message => 
            this.setState(previous => ({
                messages: GiftedChat.append(previous.messages, message)
            }) )
            );
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillMount(){
        this.off();
    }

    componentWillUnmount(){
        this.backHandler.remove();
    }

    render(){
        const chat =<GiftedChat messages={this.state.messages} onSend={this.send} user={this.user} placeholder='Masukkan Pesan' />
        return <View style={{flex: 1, backgroundColor:'white'}}>
            <View>
                <View style={Styles.header}>
                    <View style={{flex: 1, alignItems: 'center', marginHorizontal: 20, marginTop: 15, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                                <Ionicons name='md-arrow-round-back' size={25} color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:8, flexDirection: 'row', alignItems:'center'}}>
                            <Image source={require('../../assets/driver.png')} style={{width:30, height: 30}} />
                            <Text style={{fontSize: 20, color:'white', marginLeft:10}}>{this.state.driver}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView style={{flex:2}} behavior='height' enabled >
                {chat}
            </KeyboardAvoidingView>
        </View>
    }
}
