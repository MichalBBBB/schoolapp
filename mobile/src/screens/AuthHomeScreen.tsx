import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AuthStackParamList} from '../routes/AuthStack';

const AuthHomeScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'AuthHome'>
> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <View style={styles.loginButton}>
          <Text>Login</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <View style={styles.registerButton}>
          <Text>Register</Text>
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
