// import React from "react";
// const Logout = ({navigation})=>{
//     navigation.navigate('Login');

// }
// export default Logout;
import React, { useContext, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthContext } from "../../helpers/Auth";

const Logout = ({ navigation }) => {
  const { logoutUser } = useContext(AuthContext);
  
  useEffect(() => {
    logoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Logging out...</Text>
    </View>
  );
};

export default Logout;
