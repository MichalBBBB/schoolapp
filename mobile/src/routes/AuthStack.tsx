import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text, View} from 'react-native';
import AuthHomeScreen from '../screens/AuthHomeScreen';
import EmailLoginScreen from '../screens/EmailLoginScreen';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      <Stack.Screen name="Login" component={EmailLoginScreen} />
    </Stack.Navigator>
  );
};
export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Register: undefined;
};

export default AuthStack;
