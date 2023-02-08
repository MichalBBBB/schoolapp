import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {authorize} from 'react-native-app-auth';
import {isLoggedInVar} from '../App';
import {useTheme} from '../contexts/ThemeContext';
import {useGoogleSignInMutation} from '../generated/graphql';
import {AuthStackParamList} from '../routes/AuthStack';
import {setAccessToken} from '../utils/AccessToken';

const config = {
  issuer: 'https://accounts.google.com',
  clientId:
    '1073547053227-8unebat1npl554u7sficsagpmpdkb08j.apps.googleusercontent.com',
  redirectUrl:
    'com.googleusercontent.apps.1073547053227-8unebat1npl554u7sficsagpmpdkb08j:/oauth2redirect/google',
  scopes: ['openid', 'profile', 'email'],
};

const AuthHomeScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'AuthHome'>
> = ({navigation}) => {
  const theme = useTheme();
  const [googleSignIn] = useGoogleSignInMutation();

  useEffect(() => {
    console.log(theme);
  });

  const signInWithGoogle = async () => {
    try {
      const authState = await authorize(config);
      console.log(authState);
      const response = await googleSignIn({
        variables: {idToken: authState.idToken},
      });
      if (response.data) {
        setAccessToken(response.data?.googleSignIn.accessToken);
        isLoggedInVar(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <View style={styles.loginButton}>
          <Text>Email Login</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          signInWithGoogle();
        }}>
        <View style={styles.loginButton}>
          <Text>Sign in with google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loginButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'lightblue',
  },
  registerButton: {
    padding: 10,
  },
});

export default AuthHomeScreen;
