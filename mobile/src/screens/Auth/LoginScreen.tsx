import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {useLoginMutation, UserError} from '../../generated/graphql';
import {AuthStackParamList} from '../../routes/AuthStack';
import {setAccessToken} from '../../utils/AccessToken';

export const LoginScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>
> = () => {
  const [loginMutation] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Array<UserError>>([]);

  const login = async () => {
    const response = await loginMutation({variables: {password, email}});
    console.log('login', response);
    if (response.data?.login.__typename === 'UserSucces') {
      setAccessToken(response.data.login.accessToken);
      isLoggedInVar(true);
    } else if (response.data?.login.__typename === 'UserFail') {
      setErrors(response.data?.login.errors);
    }
  };

  return (
    <View style={styles.container}>
      <BasicTextInput
        style={styles.inputField}
        onChangeText={value => {
          if (errors.find(item => item.field == 'email')) {
            setErrors(errors.filter(item => item.field !== 'email') || []);
          }
          setEmail(value);
        }}
        placeholder="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        variant="filled"
        spacing="m"
        error={errors.find(item => item.field == 'email')?.message}
        containerStyle={{marginBottom: 10}}
      />

      <BasicTextInput
        style={styles.inputField}
        onChangeText={value => {
          setErrors(errors.filter(item => item.field !== 'password') || []);
          setPassword(value);
        }}
        placeholder="Password"
        textContentType="password"
        secureTextEntry={true}
        spacing="m"
        error={errors.find(item => item.field == 'password')?.message}
        containerStyle={{marginBottom: 10}}
      />

      <BasicButton onPress={() => login()} spacing="m">
        <BasicText textVariant="button" color="textContrast">
          Login
        </BasicText>
      </BasicButton>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: 'center',
    flex: 1,
  },
  inputField: {
    width: 250,
  },
  loginButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
});
