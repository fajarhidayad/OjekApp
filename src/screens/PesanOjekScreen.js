import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, YellowBox } from 'react-native'
import MapView from 'react-native-maps';
import { Polyline as Polylines } from 'react-native-maps';
import { AnimatedRegion, Marker } from 'react-native-maps';
import Styles from '../style/style';
import * as firebase from 'firebase';
import ApiKeys from '../../constants/ApiKeys';
import _ from 'lodash';
import Polyline from '@mapbox/polyline';

const GOOGLE_MAP_KEY = 'AIzaSyAl_jzi_etjLgz0LV10ECyU5Hsntnfz6q0';

YellowBox.ignoreWarnings(["Can't perform a React"]);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf("Can't perform a React") <= -1) {
        _console.warn(message);
    }
};

export default class PesanOjekScreen extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            region:{
                latitude: -7.983908,
                longitude: 112.621391,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            markers: [],
            focus: true,
            coords:[],
            x: 'false',
            cordLatitude: 0,
            cordLongitude: 0,
            distance: 0,
            startLoc: '',
            desLoc: '',
            biaya: 0,
            isVisible: true,
            desCor: '',
            curAlamat:'',
            desAlamat:'',
            status: false
        }
        this.handlePress = this.handlePress.bind(this);
        this.mergeLot = this.mergeLot.bind(this);
    }


    cekPesanan(){
        let usersRef = firebase.database().ref('Pesanan/Belum Diterima/');
        usersRef.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let exists = (snapshot.val() !== null);
            this.setState({isVisible: !exists});
        });
    }
    
    cekstatus = () => {
        let usersRef = firebase.database().ref('Pesanan/Diterima/');
        usersRef.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let exists = (snapshot.val() !== null);
            if(exists){
                this.props.navigation.navigate('OrderOjek');
            }
        });
    }
    
    handlePress(e){
        if(this.state.isVisible){
            this.setState({
                markers: [
                    {
                        coordinate: e.nativeEvent.coordinate
                    }],
                cordLatitude: e.nativeEvent.coordinate.latitude,
                cordLongitude: e.nativeEvent.coordinate.longitude,
            });
            this.mergeLot(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
        }
    }

    async getDirections(startLoc, destinationLoc) {
        
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${GOOGLE_MAP_KEY}`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let dist = respJson.routes[0].legs[0].distance.value;
            let currentLoc = respJson.routes[0].legs[0].start_address;
            let loc = currentLoc.split(',');
            let desLoc = respJson.routes[0].legs[0].end_address;
            let des = desLoc.split(',');
            let biaya = 0;
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            if(dist < 1000){
                biaya = 5000;
            }else if(dist >= 1000){
                biaya = Math.round(dist * 5 / 100)*100;
            }
            this.setState({
                coords: coords, 
                distance: dist, 
                startLoc: loc[0]+', '+loc[1], 
                desLoc: des[0]+', '+des[1], 
                biaya: biaya,
                curAlamat: loc[0],
                desAlamat: des[0]
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

    
    async getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            position => {
                let region = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421
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

    componentDidMount(){
        this.getCurrentLocation();
        this.cekPesanan();
        this.cekstatus();
    }
    
    goToInitialLocation() {
        initialRegion["latitudeDelta"] = 0.005;
        initialRegion["longitudeDelta"] = 0.005;
        this.mapView.animateToRegion(initialRegion, 2000);
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    
    orderData = (userId, startLoc, desLoc, biaya, status) =>{
        firebase.database().ref('Pesanan/Belum Diterima/' + userId).set({
            userId: userId,
            startLoc: startLoc,
            desLoc: desLoc,
            biaya: biaya,
            status: status,
            nama: firebase.auth().currentUser.displayName,
            tujuan: this.state.desAlamat,
            alamatUser: this.state.curAlamat,
            updt:false,
        });
        firebase.database().ref('users/'+firebase.auth().currentUser.uid+'/Pesanan').set({
            startLoc: startLoc,
            desLoc: desLoc,
            biaya: biaya,
            status: status,
            nama: firebase.auth().currentUser.displayName,
            tujuan: this.state.desAlamat,
            alamatUser: this.state.curAlamat,
            lokasi: this.state.region.latitude+', '+this.state.region.longitude
        })
    }
    
    orderClick = () => {
        this.setState({ isVisible: false});
        let key = firebase.auth().currentUser.uid;
        this.orderData(key, this.state.region.latitude+', '+this.state.region.longitude, this.state.desCor, this.state.biaya, 'belum');
    }

    batalPesan = () => {
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('Pesanan/Belum Diterima/').child(uid).once('value', (snapshot) => {
            let pesanan = snapshot.val();
            let key = firebase.database().ref('users/'+uid+'/riwayatPesanan').push().key;
            firebase.database().ref('users/'+uid+'/riwayatPesanan/'+key).set({
                alamatUser: pesanan.alamatUser,
                biaya: pesanan.biaya,
                status: 'Dibatalkan',
                tujuan: pesanan.tujuan
            });
        });
        firebase.database().ref('Pesanan/Belum Diterima/').child(uid).remove();
        this.setState({isVisible: true});
    }

    render(){
        return <View style={{flex: 1}}>
            <View style={Styles.header}>
                <View style={Styles.insideLogo}>
                    <Image style={{width: 18, height: 33}} source={require('../../assets/logo-putih.png')} />
                    <Text style={{color: 'white', fontSize:20}}> OJEK</Text>
                </View>
            </View>
            
            <MapView
                style={styles.map}
                // region={this.state.region}
                followUserLocation={true}
                ref={ref => (this.mapView = ref)}
                zoomEnabled={true}
                showsUserLocation={true}
                onMapReady={this.goToInitialRegion}
                initialRegion={this.state.initialRegion}
                onPress={this.handlePress}
                >
                    <Polylines
                        coordinates={this.state.coords}
                        strokeWidth={5}
                        strokeColor='red'
                    />
                    {this.state.markers.map((marker) => {
                        return <Marker key='marker' { ...marker }>
                        </Marker>
                    })}
                    
            </MapView>
            {this.state.isVisible ? 
            this.state.desLoc == '' ? <View style={{height: 80, backgroundColor: 'white', alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:25}}>Tentukan Titik Tujuan Anda</Text>
            </View> : 
            <View style={{height: 180, backgroundColor: 'white'}}>
                <View style={{flex: 4}}>
                    <View style={styles.listItems}>
                        <View style={{marginLeft:20, justifyContent:'space-around', flex: 1}}>
                            <View>
                                <Text style={{fontSize: 10}}>Lokasi Jemput:</Text>
                                <Text style={{fontSize: 15}}>{this.state.startLoc}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 10}}>Lokasi Tujuan:</Text>
                                <Text style={{fontSize: 15}}>{this.state.desLoc}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{alignItems: 'center', borderTopColor:'#d3d3d3', borderTopWidth: 2, flex: 2, justifyContent: 'center'}}>
                    <TouchableOpacity style={styles.button} onPress={this.orderClick}>
                        <View style={{justifyContent:'space-between', flexDirection:'row', paddingHorizontal: 15}}>
                            <View style={{alignItems:'flex-start'}}>
                                <Text style={{color:'white', fontSize: 20}}>Pesan</Text>
                            </View>
                            <View>
                                <Text style={{color:'white', fontSize: 20}}>Rp. {this.state.biaya}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View> : <View style={{height: 180, backgroundColor: 'white', justifyContent:'center', alignItems:'center'}}>
                        <View>
                            <ActivityIndicator size='large'/>
                            <Text style={{fontSize:20}}>Mencari Driver</Text>
                            <TouchableOpacity onPress={this.batalPesan} style={{height: 30, marginTop: 30}}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: '#D63031'}}>Batalkan Pesanan</Text>
                                </View>
                        </TouchableOpacity>
                        </View>
                </View>}
        </View>
    }
}

const styles = StyleSheet.create({
    map:{
        flex: 1
    },
    box:{
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 50
    },
    button:{
        justifyContent: 'center',
        backgroundColor: "#FDCB6E",
        alignSelf: 'stretch',
        marginHorizontal: 20,
        height: 50,
        borderRadius: 10
    },
    listItems:{
        borderBottomColor:'#d3d3d3', 
        borderBottomWidth: 2,
        flex: 4,
    },
});
