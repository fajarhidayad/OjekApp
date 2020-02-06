import React from 'react';
import {Text, View, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert} from 'react-native';
import * as firebase from 'firebase';
import Styles from '../style/style';
import { Ionicons } from '@expo/vector-icons';

export default class MenuResto extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            idResto:'a',
            makanan: {},
            resto:{},
            jumlah: [],
            modal: false,
            quantity: 1
        }
    }

    getDataMakanan = () =>{
        let id = this.props.navigation.getParam('id', 'NO-ID');
        firebase.database().ref('Jekfood/Users/'+id.toString()+'/Restaurant').on('value', (snapshot) => {
            this.setState({resto:snapshot.val()});
        })
        firebase.database().ref('Jekfood/Users/'+id.toString()).child('PostFood').on('value', (snapshot) => {
            let data = snapshot.val();
            this.setState({makanan: data});
        });
    }

    componentDidMount(){    
        this.getDataMakanan();
        console.log(this.state.jumlah)
    }

    setModal = () => {
        this.setState({modal: true});
    }
    setModalFalse = () => {
        this.setState({modal: false});
    }

    tambah = () => {
        let jumlah = this.state.quantity+1;
        this.setState({quantity: jumlah})
    }
    
    kurang = () => {
        let jumlah = this.state.quantity-1;
        if(jumlah < 1){
            this.setState({quantity: 0})
        }else{
            this.setState({quantity: jumlah})
        }
    }

    comingSoon = () => {
        Alert.alert(
            'Maaf',
            'Masih Dalam Tahap Pengembangan',
            [
                {text: 'Kembali', style:'cancel'}
            ],
            {cancelable: false}
        );
    }

    render(){
        return(
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <View style={{justifyContent:'space-between', marginHorizontal: 20, alignItems:'center', marginTop:20, flexDirection: 'row', flex:1, alignSelf:'stretch'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                            <Ionicons name='md-arrow-round-back' size={25} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name='md-cart' size={25} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal 
                    animationType='slide'
                    transparent={true}
                    visible={this.state.modal}
                >
                    <View style={{flex:1, justifyContent:'flex-end'}}>
                        <View style={{height: 200,alignSelf:'stretch', backgroundColor: 'white'}}>
                            <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row', alignItems:'flex-end', marginRight:20}}>
                                <TouchableOpacity onPress={this.setModalFalse}>
                                    <Ionicons name='ios-close' size={35}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, marginHorizontal:20}}>
                                <Text style={{fontSize: 20}}>Jumlah</Text>
                                <View style={{alignItems:'center', flexDirection: 'row', justifyContent: "space-evenly"}}>
                                    <TouchableOpacity onPress={this.kurang}>
                                        <View style={{borderWidth: 0}}>
                                            <Text style={{fontSize:30}}>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Text>{this.state.quantity}</Text>
                                    <TouchableOpacity onPress={this.tambah}>
                                        <Text style={{fontSize:30}}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', marginBottom: 10, flex: 1}}>
                                <TouchableOpacity onPress={this.comingSoon}>
                                    <View style={{backgroundColor:'green', width:300, height: 60, borderRadius: 8, flex: 1, justifyContent:'center', alignItems:"center"}}>
                                        <Text style={{fontSize:15, color:'white'}}>Tambahkan Ke Keranjang</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{height: 100, margin: 20}}>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={{fontSize:25, fontWeight:'bold'}}>{this.state.resto.resto_name}</Text>
                        <Text style={{fontSize:15}}>{this.state.resto.resto_name}</Text>
                    </View>
                </View>
                <FlatList
                    data={Object.keys(this.state.makanan)}
                    renderItem={({item}) =>
                        <View>
                            <View style={Styles.line}/>
                                <View >
                                    <TouchableOpacity style={Styles.list} onPress={this.setModal}>
                                        <View style={{ flex: 3}}>
                                            <Image source={{uri: this.state.makanan[item].image}} style={{width: 80, height: 80}} />
                                        </View>
                                        <View style={{flex: 7, flexDirection:'row'}}>
                                                <View style={{flex:7}}>
                                                    <Text style={{fontSize:18, fontWeight:'bold'}}>{this.state.makanan[item].food}</Text>
                                                    <Text style={Styles.textFood}>{this.state.makanan[item].descript}</Text>
                                                </View>
                                                <View style={{flex:3.4, justifyContent:'space-evenly'}}>
                                                        <View><Text>Rp. {this.state.makanan[item].price}</Text></View>   
                                                </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            <View style={Styles.line}/>
                        </View>}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}