import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AuthHomeScreen from '../screens/AuthHomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthHome"
        component={AuthHomeScreen}
        options={{header: () => null}}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};
export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Register: undefined;
};

export default AuthStack;
