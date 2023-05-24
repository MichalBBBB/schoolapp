import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Purchases from 'react-native-purchases';
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {packagesVar} from '../../Content';
import {
  useLoginMutation,
  useMeQuery,
  UserError,
  UserSuccess,
} from '../../generated/graphql';
import {AuthStackParamList} from '../../routes/AuthStack';
import {setAccessToken} from '../../utils/AccessToken';

export const LoginScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>
> = ({navigation}) => {
  const [loginMutation] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Array<UserError>>([]);

  const login = async () => {
    const response = await loginMutation({variables: {password, email}});
    console.log('login', JSON.stringify(response.data?.login));
    if (response.data?.login.__typename === 'UserSuccess') {
      setAccessToken(response.data.login.accessToken);
      isLoggedInVar(true);
      (async () => {
        await Purchases.logIn((response.data?.login as UserSuccess).user.id);
        await Purchases.getOfferings().then(result => {
          packagesVar(result.current?.availablePackages || []);
        });
      })();
    } else if (response.data?.login.__typename === 'UserFail') {
      setErrors(response.data?.login.errors);
    }
  };

  return (
    <View style={styles.container}>
      <BasicTextInput
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
        marginBottom={10}
      />

      <BasicTextInput
        onChangeText={value => {
          setErrors(errors.filter(item => item.field !== 'password') || []);
          setPassword(value);
        }}
        placeholder="Password"
        textContentType="password"
        secureTextEntry={true}
        spacing="m"
        error={errors.find(item => item.field == 'password')?.message}
        marginBottom={10}
      />
      <View style={{alignItems: 'flex-start'}}>
        <BasicButton
          onPress={() => {
            navigation.navigate('ForgotPasswordScreen', {email});
          }}
          variant="unstyled"
          spacing="none"
          style={{marginBottom: 20, marginLeft: 10}}>
          <BasicText
            color="textSecondary"
            style={{textDecorationLine: 'underline'}}>
            Forgot password
          </BasicText>
        </BasicButton>
      </View>

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
    flex: 1,
    marginHorizontal: 50,
  },
  loginButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
});
