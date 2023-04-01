import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {
  useLoginMutation,
  useRegisterMutation,
  UserError,
  useUserExistsMutation,
} from '../../generated/graphql';
import {getAccessToken, setAccessToken} from '../../utils/AccessToken';
const EmailLoginScreen = () => {
  const [registerMutation] = useRegisterMutation();
  const [loginMutation] = useLoginMutation();
  const [userExistsMutation] = useUserExistsMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordControl, setPasswordControl] = useState('');
  const [fullName, setFullName] = useState('');

  const [userExists, setUserExists] = useState<null | Boolean>(null);

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

  const register = async () => {
    const response = await registerMutation({
      variables: {email, password, name: fullName},
    });
    console.log('register', response);
    if (response.data?.register.__typename === 'UserSucces') {
      setAccessToken(response.data.register.accessToken);
      isLoggedInVar(true);
    } else if (response.data?.register.__typename === 'UserFail') {
      setErrors(response.data.register.errors);
    }
  };

  const checkIfUserExists = async () => {
    const result = await userExistsMutation();
    if (result.data?.userExists.__typename == 'UserExistsSucces') {
      setUserExists(result.data.userExists.userExists);
    } else if (result.data?.userExists.__typename == 'UserFail') {
      setErrors(result.data?.userExists.errors);
    }
  };

  return (
    <View style={styles.container}>
      <BasicTextInput
        style={styles.inputField}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        variant="filled"
        spacing="m"
      />
      {userExists == false && (
        <BasicTextInput
          style={styles.inputField}
          onChangeText={setFullName}
          placeholder="Full Name"
          spacing="m"
        />
      )}
      {userExists !== null && (
        <BasicTextInput
          style={styles.inputField}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          spacing="m"
        />
      )}
      {userExists == false && (
        <BasicTextInput
          style={styles.inputField}
          onChangeText={setPasswordControl}
          placeholder="Repeat password"
          secureTextEntry={true}
          spacing="m"
        />
      )}
      {userExists == null ? (
        <BasicButton
          onPress={() => {
            checkIfUserExists();
          }}
          spacing="m">
          <BasicText color="textContrast" textVariant="button">
            Next
          </BasicText>
        </BasicButton>
      ) : userExists ? (
        <BasicButton onPress={() => login()} spacing="m">
          <BasicText textVariant="button" color="textContrast">
            Login
          </BasicText>
        </BasicButton>
      ) : (
        <BasicButton onPress={() => register()} spacing="m">
          <BasicText textVariant="button" color="textContrast">
            Register
          </BasicText>
        </BasicButton>
      )}
      {errors.length > 0 &&
        // TODO - change to proper errors
        errors.map((item, index) => <Text key={index}>{item.message}</Text>)}
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
    marginBottom: 10,
  },
  loginButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
});

export default EmailLoginScreen;
