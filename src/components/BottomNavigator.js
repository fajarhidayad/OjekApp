import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, YellowBox, FlatList, Alert } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import Styles from '../style/style';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ApiKeys from '../../constants/ApiKeys';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['VirtualizedList']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
    if (message.indexOf('VirtualizedList') <= -1) {
        _console.warn(message);
    }
};


class BerandaScreen extends React.Component{

    constructor(){
        super();
        
    }

    componentDidMount(){
        this.userID();
    }

    userID = () => {
        let key = firebase.auth().currentUser.uid;
        if(firebase.database().ref('users/' + key) === null){
            firebase.database().ref('users/' + key).set({
                nama: firebase.auth().currentUser.displayName
            });
        }
    }
    
    render(){    
        return <View style={Styles.container}>
            <View style={Styles.header}>
                <View style={Styles.insideLogo}>
                    <Image style={{width: 18, height: 33}} source={require('../../assets/logo-putih.png')} />
                    <Text style={{color: 'white', fontSize:20}}> OJEK</Text>
                </View>
            </View>
            <View style={{alignItems: 'center', justifyContent:'space-around'}}>
            <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('PesanOjek')}>
                <View style={{flex:1, alignItems:'center', justifyContent:'space-around', flexDirection: 'row', marginHorizontal:20}}>
                    <Text style={{flexWrap:"wrap", fontSize: 45, flex: 1}}>Pesan Ojek</Text>
                    <View style={{borderRadius: 155, backgroundColor:'#81ECEC', width:155, height: 155, alignItems:'center', justifyContent:'space-evenly'}}>
                        <Image style={{width: 92, height: 93}} source={require('../../assets/pesanOjek.png')} />
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('PesanMakanan')}>
                <View style={{flex:1, alignItems:'center', justifyContent:'space-around', flexDirection: 'row', marginHorizontal:20}}>
                    <View style={{borderRadius: 155, backgroundColor:'#D63031', width:155, height: 155, alignItems:'center', justifyContent:'space-evenly'}}>
                        <Image style={{width: 92, height: 93}} source={require('../../assets/pesanMakan.png')} />
                    </View>
                    <Text style={{flexWrap:"wrap", fontSize: 45, flex: 1, textAlign:'right'}}>Pesan Makan</Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    }
}

class PesananScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            pesanan: false,
            user: '',
        }
    }

    cekPesanan(){
        let usersRef = firebase.database().ref('Pesanan/Belum Diterima/');
        usersRef.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let exists = (snapshot.val() !== null);
            this.setState({pesanan: exists});
        });
    }

    getPesananUser(){
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('Pesanan/Belum Diterima/'+uid).on('value', (snapshot) => {
            let user = snapshot.val();
            this.setState({
                user: user
            });
        });
    }

    componentDidMount(){
        this.cekPesanan();
        this.getPesananUser();
    }

    render(){
        return <View style={Styles.container}>
            <View style={Styles.header}>
                <View style={Styles.insideLogo}>
                    <Image style={{width: 18, height: 33}} source={require('../../assets/logo-putih.png')} />
                    <Text style={{color: 'white', fontSize:20}}> OJEK</Text>
                </View>
            </View>
            {this.state.pesanan ? <TouchableOpacity>
                <View style={Styles.listFood}>
                    <View style={{ flex: 3 }}>
                        <Image style={{width: 54, height:55}} source={require('../../assets/pesanOjek.png')}/>
                    </View>
                    <View style={{flex: 7}}>
                        <Text style={{fontSize:18, fontWeight:'bold'}}>Dalam Perjalanan</Text>
                        <Text style={Styles.textFood}>{this.state.user.alamatUser}</Text>
                        <Text style={Styles.textFood}>{this.state.user.tujuan}</Text>
                    </View>
                </View>
                    <View style={Styles.line}/>
            </TouchableOpacity> : <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20}}>Belum Ada Pesanan</Text>
                </View>}
        </View>
    }
}

class AkunScreen extends React.Component{
    
    state = {
        email: '',
        nama: '',
        telepon: '',
        pesanan: {},
    }

    cekPesanan = () => {
        firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/').child('riwayatPesanan').on('value', (snapshot) => {
            let data = snapshot.val();
            this.setState({pesanan: data});
        });
    }

    componentDidMount(){
        this.getUser();
        this.cekPesanan();
    }

    getUser = () => {
        let user = firebase.auth().currentUser;
        if(user != null){
            this.setState({
                nama: user.displayName,
                email: user.email,
                telepon: user.phoneNumber
            });
        }
    }

    signOut = () => {
        Alert.alert('Peringatan', 'Apakah Anda Yakin ?', [
            {text: 'Ya', onPress: () => firebase.auth().signOut() },
            {text:'Cancel', style:"cancel"}
        ], {cancelable: false})
    }


    render(){
        return <View style={Styles.container}>
            <View style={Styles.header}>
                <View style={Styles.insideLogo}>
                    <Image style={{width: 18, height: 33}} source={require('../../assets/logo-putih.png')} />
                    <Text style={{color: 'white', fontSize:20}}> OJEK</Text>
                </View>
            </View>

                <View style={{flexDirection: 'row', margin: 25, justifyContent:'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={styles.text}>{this.state.nama}</Text>
                            <Text style={styles.text}>{this.state.telepon}</Text>
                            <Text style={styles.text}>{this.state.email}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{height: 18}} onPress={() => this.props.navigation.navigate('AkunSettings')}>
                        <Text style={{color:'green'}}>UBAH</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 10, backgroundColor:'#d3d3d3'}}></View>
            <View style={{flex: 6, margin: 15}}>
                <Text>Riwayat Pesanan</Text>
                <FlatList
                    data={Object.keys(this.state.pesanan)}
                    renderItem={({item}) => <TouchableOpacity>
                        <View style={Styles.listFood}>
                            <View style={{ flex: 3}}>
                                <Image style={{width: 54, height:55}} source={require('../../assets/pesanOjek.png')}/>
                            </View>
                            <View style={{flex: 7}}>
                                <Text style={{fontSize:18, fontWeight:'bold'}}>{this.state.pesanan[item].tujuan}</Text>
                                <Text style={Styles.textFood}>Rp. {this.state.pesanan[item].biaya}</Text>
                                <Text style={Styles.textFood}>{this.state.pesanan[item].alamatUser}</Text>
                                <Text style={Styles.textFood}>{this.state.pesanan[item].status}</Text>
                            </View>
                        </View>
                        <View style={Styles.line}/>
                    </TouchableOpacity>}
                />
            </View>
            <View style={{flex: 2, alignItems:'center', justifyContent:'flex-end'}}>
                <TouchableOpacity
                style={{alignSelf:"stretch", height:52, backgroundColor:'#D63031'}}
                onPress={this.signOut}
                >
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}} >
                        <Text style={{color:'white', fontSize:18}}>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
        </View>;
    }
}

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let iconName;
    if(routeName === 'Beranda'){
        iconName = `ios-home`;
    } else if(routeName === 'Pesanan'){
        iconName = `ios-list-box`;
    } else if(routeName === 'Akun'){
        iconName = `md-person`;
    }
    return <Ionicons name={iconName} size={25} color={tintColor} />;
};

const styles = StyleSheet.create({
    card:{
        shadowOffset:{ width: 0, height: 2},
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 50,
        backgroundColor:"#E7E7E7", 
        width: 338, 
        height: 200,
        borderRadius: 15
    },
    text:{
        fontSize:18
    }
})

export default createAppContainer(
    createBottomTabNavigator(
        {
            Beranda: { screen: BerandaScreen },
            Pesanan: { screen: PesananScreen },
            Akun: { screen: AkunScreen },
        },
        {
            defaultNavigationOptions: ({ navigation }) => ({
                tabBarIcon: ({focused, tintColor }) => 
                getTabBarIcon(navigation, focused, tintColor),
            }),
            tabBarOptions: {
                activeTintColor: '#FDCB6E',
                inactiveTintColor: 'gray',
            },
        }
    )
);