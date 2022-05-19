import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {AuthStackParamList} from '../routes/AuthStack';

const AuthHomeScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'AuthHome'>
> = ({navigation}) => {
  const theme = useTheme();

  useEffect(() => {
    console.log(theme);
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <View style={styles.loginButton}>
          <Text>Email Login</Text>
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
