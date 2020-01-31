import React from 'react';
import { Text, View, StyleSheet, Image, FlatList, Alert } from 'react-native';
import Styles from '../style/style';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase';

class PesanMakanan extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: {}
        }
    }

    getRestoran = () => {
        firebase.database().ref('Jekfood/').child('Users').on('value', (snapshot) => {
            let data = snapshot.val();
            this.setState({data: data});
        });
    }

    componentDidMount(){
        this.getRestoran();
    }

    render(){
        return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                <View style={{justifyContent:'flex-start', alignItems:'center', marginTop:20, paddingLeft:25}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                        <Ionicons name='md-arrow-round-back' size={25} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{alignItems: "center", marginVertical: 20}}>
                <TextInput
                    style={Styles.textFieldBorder}
                    placeholder='Cari Makanan'
                />
            </View>
            <FlatList
                data={Object.keys(this.state.data)}
                renderItem={({ item }) => <View>
                    { this.state.data[item].Restaurant.status_resto ? <TouchableOpacity onPress={() => this.props.navigation.navigate('MenuResto', {id: this.state.data[item].Restaurant.idResto})}>
                        <View style={Styles.line}/>
                            <View style={Styles.listFood}>
                                <View style={{ flex: 3}}>
                                    <Ionicons name='md-pizza' size={58} color='#D63031'/>
                                </View>
                                <View style={{flex: 7}}>
                                    <Text style={{fontSize:18, fontWeight:'bold'}}>{this.state.data[item].Restaurant.resto_name}</Text>
                                    <Text style={Styles.textFood}>{this.state.data[item].Restaurant.street}</Text>
                                </View>
                            </View>
                        <View style={Styles.line}/>
                    </TouchableOpacity> : <TouchableOpacity>
                        <View style={Styles.line}/>
                            <View style={Styles.listFood}>
                                <View style={{ flex: 3}}>
                                    <Ionicons name='md-pizza' size={58} color='gray'/>
                                </View>
                                <View style={{flex: 7}}>
                                    <Text style={{fontSize:18, fontWeight:'bold'}}>{this.state.data[item].Restaurant.resto_name} (Tutup)</Text>
                                    <Text style={Styles.textFood}>{this.state.data[item].Restaurant.location}</Text>
                                </View>
                            </View>
                        <View style={Styles.line}/>
                    </TouchableOpacity>}
                </View>}
            />
        </View>
        )
    }
}

export default PesanMakanan;

// this.state.data[item].Restaurant.status_resto 