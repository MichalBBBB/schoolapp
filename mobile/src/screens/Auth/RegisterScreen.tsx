import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Purchases from 'react-native-purchases';
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {packagesVar} from '../../Content';
import {
  useRegisterMutation,
  UserError,
  UserSuccess,
} from '../../generated/graphql';
import {AuthStackParamList} from '../../routes/AuthStack';
import {setAccessToken} from '../../utils/AccessToken';

export const RegisterScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'RegisterScreen'>
> = () => {
  const [registerMutation] = useRegisterMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordControl, setPasswordControl] = useState('');
  const [fullName, setFullName] = useState('');

  const [errors, setErrors] = useState<Array<UserError>>([]);

  const register = async () => {
    const response = await registerMutation({
      variables: {email, password, name: fullName},
    });
    console.log('register', response);
    if (response.data?.register.__typename === 'UserSuccess') {
      setAccessToken(response.data.register.accessToken);
      isLoggedInVar(true);
      (async () => {
        await Purchases.logIn((response.data?.register as UserSuccess).user.id);
        await Purchases.getOfferings().then(result => {
          packagesVar(result.current?.availablePackages || []);
        });
      })();
    } else if (response.data?.register.__typename === 'UserFail') {
      setErrors(response.data.register.errors);
    }
  };

  const checkPasswordControl = () => {
    if (password !== passwordControl) {
      setErrors([
        ...errors,
        {
          field: 'passwordControl',
          message: 'Passwords do not match',
        },
      ]);
      return false;
    } else {
      return true;
    }
  };

  return (
    <View style={styles.container}>
      <BasicTextInput
        style={styles.inputField}
        onChangeText={value => {
          setErrors(errors.filter(item => item.field !== 'email') || []);
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
        onChangeText={setFullName}
        placeholder="Full Name"
        spacing="m"
        containerStyle={{marginBottom: 10}}
        autoCapitalize="words"
      />
      <BasicTextInput
        textContentType="newPassword"
        style={styles.inputField}
        onChangeText={value => {
          setErrors(errors.filter(item => item.field !== 'password') || []);
          setPassword(value);
        }}
        placeholder="Password"
        secureTextEntry={true}
        spacing="m"
        error={errors.find(item => item.field == 'password')?.message}
        containerStyle={{marginBottom: 10}}
      />
      <BasicTextInput
        textContentType="newPassword"
        style={styles.inputField}
        onChangeText={value => {
          setErrors(
            errors.filter(item => item.field !== 'passwordControl') || [],
          );
          setPasswordControl(value);
        }}
        placeholder="Repeat password"
        secureTextEntry={true}
        spacing="m"
        onEndEditing={() => {
          checkPasswordControl();
        }}
        error={errors.find(item => item.field == 'passwordControl')?.message}
        containerStyle={{marginBottom: 10}}
      />

      <BasicButton
        onPress={() => {
          const passwordsMatch = checkPasswordControl();
          if (passwordsMatch) {
            register();
          }
        }}
        spacing="m">
        <BasicText textVariant="button" color="textContrast">
          Register
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
