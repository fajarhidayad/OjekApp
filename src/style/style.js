import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    logo: {
        width:147, 
        height:79, 
        backgroundColor:"white", 
        borderRadius:13, 
        overflow:"hidden",
    },
    insideLogo: {
        flex:1,
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:"flex-start",
        marginTop:20
    },
    textField:{
        height: 40,
        paddingLeft: 6,
        width: 328,
        marginVertical: 15
    },
    header:{
        flexDirection: 'row',
        height: 70,
        backgroundColor: "#FDCB6E",
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    textFieldBorder:{
        marginVertical:10, 
        height: 50, 
        borderColor: 'rgba(71, 71, 71, .3)', 
        borderWidth: 1, 
        paddingLeft: 10, 
        width: 328, },
    line:{
        borderBottomColor: 'rgba(71, 71, 71, .3)',
        borderBottomWidth: 1,
    },
    textFood:{
        color:'#939393', 
        marginTop:7
    },
    listFood:{
        flexDirection: "row", 
        alignItems:'center', 
        marginHorizontal:40, 
        marginVertical:20
    },
    list:{
        flexDirection: "row", 
        alignItems:'center', 
        marginHorizontal:20, 
        marginVertical:5
    }
});