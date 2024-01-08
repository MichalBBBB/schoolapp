import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text, View} from 'react-native';
import AuthHomeScreen from '../screens/Auth/AuthHomeScreen';
import {ForgotPasswordScreen} from '../screens/Auth/ForgotPasswordScreen';
import {LoginScreen} from '../screens/Auth/LoginScreen';
import {RegisterScreen} from '../screens/Auth/RegisterScreen';

const AuthStack = () => {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthHome"
        component={AuthHomeScreen}
        options={{
          title: 'Account',
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Log in',
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register',
        }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{title: 'Reset password'}}
      />
    </Stack.Navigator>
  );
};
export type AuthStackParamList = {
  AuthHome: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: {email?: string};
};

export default AuthStack;
