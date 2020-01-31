import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, BackHandler, Image, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { Polyline as Polylines } from 'react-native-maps';
import { AnimatedRegion, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Styles from '../style/style';
import * as firebase from 'firebase';
import ApiKeys from '../../constants/ApiKeys';
import Polyline from '@mapbox/polyline';

const GOOGLE_MAP_KEY = 'AIzaSyAl_jzi_etjLgz0LV10ECyU5Hsntnfz6q0';

export default class OrderOjekScreen extends React.Component{
    constructor(props){
        let alert = true;
        super(props);
        this.state = {
            user: {},
            region:{
                latitude: -7.983908,
                longitude: 112.621391,
                latitudeDelta: 0.922,
                longitudeDelta: 0.421
            },
            markers: [],
            coords:[],
            startLoc: '',
            desLoc: '',
            biaya: 0,
            desCor: '',
            desLat: 0,
            desLong: 0,
            userLat: 0,
            userLong: 0,
            driverLat: 0,
            driverLong: 0,
            driver: '',
            idDriver:'',
            pesanan: true,
            status:''
        }
    }

    getData = () => {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid+'/Pesanan').on('value', (snapshot) => {
            let data = snapshot.val();
            let desLatLong = data.desLoc.split(',');
            let driverLoc = data.lokasi.split(',');
            let userLoc = data.startLoc.split(',');
            this.setState({
                user: data,
                desLat: desLatLong[0],
                desLong: desLatLong[1],
                startLoc: data.alamatUser,
                desLoc: data.tujuan,
                driver: data.namaDriver,
                biaya: data.biaya,
                userLat: userLoc[0],
                userLong: userLoc[1],
                idDriver: data.idDriver,
                driverLat: driverLoc[0],
                driverLong: driverLoc[1],
            });
        });
    }

    cekStatus = () => {
        firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/Pesanan').on('value', (snapshot) => {
            let data = snapshot.val();
            this.setState({status: data.status});
            if(data.status == 'Selesai'){
                firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/riwayatPesanan').push().set({
                    alamatUser: this.state.startLoc,
                    biaya: this.state.biaya,
                    status: 'Selesai',
                    tujuan: this.state.desLoc
                })
                Alert.alert(
                    'Terima Kasih',
                    'Anda Sudah Sampai di Tujuan',
                    [
                        {text: 'Oke', onPress: this.pesananSelesai}
                    ],
                    {cancelable: false}
                );
            }
        });
    }

    pesananSelesai = () => {
        this.props.navigation.navigate('Bottom');
        firebase.database().ref('Pesanan/Diterima/'+firebase.auth().currentUser.uid).set({
            userId: '',
            startLoc: '',
            desLoc: '',
            biaya: '',
            status: 'Selesai',
            nama: '',
            tujuan: '',
            alamatUser: '',
            lokasi: ''
        });
    }

    async getDirections(startLoc, destinationLoc) {
        
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${GOOGLE_MAP_KEY}`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({
                coords: coords,
                startLoc: loc[0]+', '+loc[1], 
                desLoc: des[0]+', '+des[1],
                markers: [{
                    latitude: parseFloat(this.state.desLat),
                    longitude: parseFloat(this.state.desLong),
                }]
            });
            
            return coords;
        } catch(error) {
            console.log(error);
            return error;
        }
    }

    mergeLot(desLat, desLong){
        let concatLot = `${this.state.region.latitude} ,${this.state.region.longitude}`
        let concatDes = `${desLat} ,${desLong}`
        this.setState({
            concat: concatLot,
            desCor: concatDes
        }, () => {
            this.getDirections(concatLot, concatDes);
        });
    }

    updateLoc = () => {
        firebase.database().ref('Pesanan/Diterima/'+firebase.auth().currentUser.uid).once('value', snapshot => {
            let status = snapshot.val();
            if(status !== null){
                if(status.updt){
                    let loc = this.state.region.latitude+', '+this.state.region.longitude;
                    firebase.database().ref('Pesanan/Diterima/'+firebase.auth().currentUser.uid).update({
                        startLoc: loc
                    })
                }else{
                    clearInterval(this.updateLoc);
                }
            }
        })
    }

    async getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            position => {
                let region = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: 0.004922,
                    longitudeDelta: 0.004421
                };
                this.setState({
                    initialRegion: region,
                    region: region
                });
                this.mergeLot();
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
            );
    }

    cekPesanan = () => {
        const uid = firebase.auth().currentUser.uid;
        if(!this.state.pesanan){
            this.setState({pesanan: true});
            Alert.alert(
                'Maaf',
                'Pesanan Anda Dibatalkan Oleh Driver',
                [
                    {text: 'Kembali ke Menu', onPress: () => this.props.navigation.navigate('Bottom')}
                ],
                {cancelable: false}
            );
        }else{
            firebase.database().ref('Pesanan/Diterima/'+uid).once('value', (snapshot) => {
                let exists = (snapshot.val() !== null)
                if(exists){
                    this.getData();
                }else{
                    this.setState({pesanan: true});
                }
            });
        }
    }
    
    
    componentWillUnmount(){
        this.backHandler.remove();
    }
    
    handleBackPress = () => {
        this.props.navigation.navigate('Bottom');
        return true;
    }

    batalPesan = () => {
        if(this.state.pesanan){
            Alert.alert(
                '',
                'Apakah Anda Yakin ?',
                [
                    {text: 'Ya', onPress: this.batalkan.bind(this)},
                    {text: 'Tidak', style:'cancel'}
                ],
                {cancelable: false},
                );
            }
        }
        
    batalkan = () => {
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('Pesanan/Diterima/').child(uid).once('value', (snapshot) => {
            let pesanan = snapshot.val();
            let key = firebase.database().ref('users/'+uid+'/riwayatPesanan').push().key;
            firebase.database().ref('users/'+uid+'/riwayatPesanan/'+key).set({
                alamatUser: pesanan.alamatUser,
                biaya: pesanan.biaya,
                status: 'Dibatalkan',
                tujuan: pesanan.tujuan,
                driver: pesanan.namaDriver
            });
        });
        this.props.navigation.navigate('Bottom');
        firebase.database().ref('UserBojek/Pesanan/'+this.state.idDriver).update({
            biaya:0,
            desLoc:this.state.region.latitude+', '+this.state.region.longitude,
            end:"Bogs",
            idUser:"Bogs",
            nama:"",
            start:"",
            status:"Bogs",
            loop: false
        });
        Alert.alert(
            'Pesan',
            'Pesanan Anda Dibatalkan',
            [
                {text: 'Kembali ke Menu', onPress: () => this.props.navigation.navigate('Bottom')}
            ],
            {cancelable: false}
        );
        firebase.database().ref('Pesanan/Diterima/'+firebase.auth().currentUser.uid).remove();
    }
    
    blockPress = () => {
        Alert.alert(
            'Maaf',
            'Pesanan Anda Tidak Dapat Dibatalkan',
            [
                {text: 'Kembali', style:'cancel'}
            ],
            {cancelable: false}
            );
        }

        componentDidMount(){
            setInterval(this.updateLoc, 15000);
            this.cekPesanan();
            this.cekStatus();
            this.mergeLot(this.state.desLat, this.state.desLong);
            this.getCurrentLocation();
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        }
        
        render(){
            return <View style={{flex: 1}}>
            <MapView
                style={{flex: 1}}
                region={this.state.region}
                followUserLocation={true}
                ref={ref => (this.mapView = ref)}
                zoomEnabled={true}
                showsUserLocation={true}
                onMapReady={this.goToInitialLocation}
                initialRegion={this.state.initialRegion}
                >
                    <Polylines
                        coordinates={this.state.coords}
                        strokeWidth={5}
                        strokeColor='red'
                    /> 
                    <Marker key='marker' coordinate={{latitude:parseFloat(this.state.desLat), longitude:parseFloat(this.state.desLong)}}>
                    </Marker>
                    <Marker key='driver' coordinate={{latitude:parseFloat(this.state.driverLat), longitude:parseFloat(this.state.driverLong)}}
                    image={require('../../assets/scooter.png')}
                    >
                    </Marker>
                    
            </MapView>
            <View style={{height: 350, backgroundColor: 'white', justifyContent:'center'}}>
                <View style={{flex:1}}>
                    <View style={{flex:0.5, margin:15, alignItems: 'center'}}>
                        {this.state.status == 'Diterima' ? <Text style={{fontSize: 17}}>Driver Sedang Menjemput Anda</Text> : 
                        <View style={{alignItems:'center'}}><Text style={{fontSize: 17}}>Driver sedang mengantar Anda</Text><Text style={{fontSize: 17}}>Hati-hati di jalan</Text></View>}
                    </View>
                    <View style={{flex:3, marginHorizontal:30,}}>
                        <View style={{marginVertical: 5}}>
                            <Text>Lokasi Awal</Text>
                            <Text>{this.state.startLoc}</Text>
                        </View>
                        <View style={{marginVertical: 5}}>
                            <Text>Lokasi Tujuan</Text>
                            <Text>{this.state.desLoc}</Text>
                        </View>
                        <View style={{marginVertical: 5}}>
                            <View style={{flexDirection:'row'}}>
                                <Image source={require('../../assets/driver.png')} style={{width:50, height: 50}}/>
                                <View style={{flex:1, justifyContent:'center', marginHorizontal:10}}>
                                    <Text>Driver :</Text>
                                    <Text style={{fontSize: 20}}>{this.state.driver}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginVertical:15}}>
                            <Text style={{fontSize:20}}>Rp. {this.state.biaya} </Text>
                        </View>        
                    </View>
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <View style={{flex: 2, flexDirection:'row'}}>
                            <TouchableOpacity style={{flex:3, backgroundColor:'#00B894'}} onPress={() => this.props.navigation.navigate('Chat')}>
                                <View style={{alignItems:'center', justifyContent:"center", flex:1}}>
                                    <Ionicons name='ios-chatbubbles' size={30} color='white' />
                                    <Text style={{color:'white'}}>Chat</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex:3, backgroundColor:'#D63031'}} onPress={this.state.status == 'Diterima' ? this.batalPesan : this.blockPress}>
                                <View style={{alignItems:'center', justifyContent:"center", flex:1}}>
                                    <Ionicons name='md-close-circle-outline' size={30} color='white' />
                                    <Text style={{color:'white'}}>Batalkan Pesanan</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    }

}

const styles = StyleSheet.create({

});