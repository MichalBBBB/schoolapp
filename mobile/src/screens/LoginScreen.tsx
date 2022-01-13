import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default LoginScreen;
