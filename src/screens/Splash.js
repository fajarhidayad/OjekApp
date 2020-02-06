import React, { Component, useState } from 'react';
import { Animated, View, Text, StyleSheet, Image } from 'react-native';

export default class Splash extends React.Component {
    constructor(props){
        super(props);
        this.fadeAnim = new Animated.Value(1);
    }
    componentDidMount(){
        Animated.timing(       
            this.fadeAnim, 
            {
                toValue: 0,
                duration: 3000,
            }
            ).start(() => {
                this.props.navigation.navigate('Home');
            });
        
    }


    render(){
        return(
            <View style={styles.container}>
                <Animated.View style={{ ...this.props.style, opacity: this.fadeAnim }}>
                    <View style={styles.logo}>
                        <View style={styles.insideLogo}>
                            <Image style={{width: 38, height: 53}} source={require('../../assets/logo.png')} />
                            <Text style={{color: '#6E6161', fontSize:40}}> OJEK</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>  
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width:170, 
        height:102, 
        backgroundColor:"white", 
        borderRadius:13, 
        overflow:"hidden",
    },
    insideLogo: {
        flex:1, 
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:"center"
    },
    container: {
        flex: 1,
        backgroundColor: '#FDCB6E',
        alignItems: 'center',
        justifyContent:"space-around"
    }

});