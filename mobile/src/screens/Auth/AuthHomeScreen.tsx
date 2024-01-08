import {GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL} from '@env';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {authorize} from 'react-native-app-auth';
import {isLoggedInVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {useTheme} from '../../contexts/ThemeContext';
import {
  useAppleSignInMutation,
  useGoogleSignInMutation,
} from '../../generated/graphql';
import {AuthStackParamList} from '../../routes/AuthStack';
import {setAccessToken} from '../../utils/AccessToken';
import appleAuth, {
  AppleButton,
  AppleButtonStyle,
} from '@invertase/react-native-apple-authentication';

const config = {
  issuer: 'https://accounts.google.com',
  clientId: GOOGLE_CLIENT_ID,
  // '1073547053227-8unebat1npl554u7sficsagpmpdkb08j.apps.googleusercontent.com',
  redirectUrl: GOOGLE_REDIRECT_URL,
  // 'com.googleusercontent.apps.1073547053227-8unebat1npl554u7sficsagpmpdkb08j:/oauth2redirect/google',
  scopes: ['openid', 'profile', 'email'],
};

const AuthHomeScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'AuthHome'>
> = ({navigation}) => {
  const [theme] = useTheme();

  const [googleSignIn] = useGoogleSignInMutation();
  const [appleSignIn] = useAppleSignInMutation();

  const signInWithGoogle = async () => {
    try {
      const authState = await authorize(config);
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

  const onAppleButtonPress = async () => {
    const {identityToken, nonce, email, fullName} =
      await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
    // const credentialState = await appleAuth.getCredentialStateForUser(
    //   appleAuthRequestResponse.user,
    // );
    if (identityToken && nonce && fullName) {
      const response = await appleSignIn({
        variables: {
          idToken: identityToken,
          nonce: nonce,
          fullName: fullName.givenName + ' ' + fullName.familyName,
        },
      });
      if (response.data) {
        setAccessToken(response.data.appleSignIn.accessToken);
        isLoggedInVar(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <BasicButton
        onPress={() => navigation.navigate('LoginScreen')}
        style={{marginBottom: 5, width: 250}}>
        <BasicText
          color="textContrast"
          spacing="s"
          style={{fontWeight: 'bold'}}>
          Log in
        </BasicText>
      </BasicButton>
      <BasicButton
        onPress={() => navigation.navigate('RegisterScreen')}
        style={{marginBottom: 5, width: 250}}>
        <BasicText
          color="textContrast"
          spacing="s"
          style={{fontWeight: 'bold'}}>
          Register
        </BasicText>
      </BasicButton>
      <BasicButton
        style={{width: 250, marginBottom: 5}}
        onPress={() => {
          signInWithGoogle();
        }}
        variant="outlined">
        <BasicText color="text" style={{fontWeight: 'bold'}} spacing="s">
          Sign in with google
        </BasicText>
      </BasicButton>
      <AppleButton
        buttonStyle={
          theme.dark ? AppleButton.Style.WHITE : AppleButton.Style.BLACK
        }
        buttonType={AppleButton.Type.CONTINUE}
        style={{width: 250, height: 40}}
        onPress={() => {
          onAppleButtonPress();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default AuthHomeScreen;
