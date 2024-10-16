import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image, SafeAreaView  } from 'react-native';

const Home = () =>{
    const navigation = useNavigation();
    const handleLogin = ()=>{
        navigation.navigate('Login')
    }
    const handleSignUp = ()=>{
        navigation.navigate('SignUp')
    }
    return(
        <>
        <SafeAreaView style={{ flex: 1, backgroundColor:'white' }}>
        <View>
            <Image source={require('../assets/img/home.jpg')} style={styles.logo}></Image>
        </View>
        <View>
            <Text style={styles.welcome}>
                Welcome Back
            </Text>
        </View>
        <View style={styles.container}>
            
            <View style={styles.button}>
                <TouchableOpacity style={styles.inBut} onPress={handleLogin}>
                    <Text style={styles.textSign}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.button}>
                <TouchableOpacity style={styles.inBut1} onPress={handleSignUp}>
                    <Text style={styles.textSign}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        
        </View>
        </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      logo: {
        height: 400,
        width: '100%',
        marginTop: 30,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
      },
      welcome:{
        paddingTop: 30,
        fontSize:30,
        textAlign: 'center',
        fontWeight:'bold',
      },
      inBut: {
        width: '94%',
        backgroundColor: '#aa18ea',
        alignItems: 'center',
        paddingHorizontal: 100,
        paddingVertical: 15,
        borderRadius: 50,
      },
      inBut1: {
        width: '94%',
        backgroundColor: '#aa18ea',
        alignItems: 'center',
        paddingHorizontal: 94,
        paddingVertical: 15,
        borderRadius: 50,
      },
      button: {
        alignItems: 'center',
        marginTop: -10,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
})
export default Home;