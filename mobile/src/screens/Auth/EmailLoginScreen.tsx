import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {isLoggedInVar} from '../../App';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {
  useLoginMutation,
  useRegisterMutation,
  UserError,
  useUserExistsLazyQuery,
  useUserExistsQuery,
} from '../../generated/graphql';
import {getAccessToken, setAccessToken} from '../../utils/AccessToken';
const EmailLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordControl, setPasswordControl] = useState('');
  const [fullName, setFullName] = useState('');
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [checkUserExists, {data: UserExistsResult}] = useUserExistsLazyQuery();
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

  return (
    <View style={styles.container}>
      <BasicTextInput
        style={styles.inputField}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
      />
      {UserExistsResult && !UserExistsResult.userExists && (
        <BasicTextInput
          style={styles.inputField}
          onChangeText={setFullName}
          placeholder="Full Name"
        />
      )}
      {UserExistsResult && (
        <BasicTextInput
          style={styles.inputField}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
        />
      )}
      {UserExistsResult && !UserExistsResult.userExists && (
        <BasicTextInput
          style={styles.inputField}
          onChangeText={setPasswordControl}
          placeholder="Repeat password"
          secureTextEntry={true}
        />
      )}
      {!UserExistsResult ? (
        <TouchableOpacity
          onPress={() => {
            checkUserExists({variables: {email}});
          }}>
          <View style={styles.loginButton}>
            <Text>Next</Text>
          </View>
        </TouchableOpacity>
      ) : UserExistsResult.userExists ? (
        <TouchableOpacity onPress={() => login()}>
          <View>
            <Text>Login</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => register()}>
          <View>
            <Text>Register</Text>
          </View>
        </TouchableOpacity>
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
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    width: 250,
  },
  loginButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
});

export default EmailLoginScreen;
