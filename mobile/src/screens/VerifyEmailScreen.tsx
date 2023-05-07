import React from 'react';
import {useApolloClient} from '@apollo/client';
import {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {isLoggedInVar} from '../App';
import {BasicButton} from '../components/basicViews/BasicButton';
import {BasicText} from '../components/basicViews/BasicText';
import BasicInputWindow from '../components/modals/basicInputWindow';
import {useTheme} from '../contexts/ThemeContext';
import {
  MeDocument,
  useEditUserMutation,
  useLogoutMutation,
  useMeQuery,
  useResendVerificationEmailMutation,
} from '../generated/graphql';
import {useEditUser} from '../mutationHooks/user/edituser';
import {setAccessToken} from '../utils/AccessToken';

export const VerifyEmailScreen = () => {
  const [logout] = useLogoutMutation();
  const [resendVerificationEmail] = useResendVerificationEmailMutation();
  const [theme] = useTheme();
  const {data: me} = useMeQuery();
  const [changeEmailWindowVisible, setChangeEmailWindowVisible] =
    useState(false);
  const [editUser] = useEditUserMutation({
    context: {
      skipQueue: true,
    },
    refetchQueries: [MeDocument],
  });

  const client = useApolloClient();

  const reloadMe = () => {
    client.query({query: MeDocument, fetchPolicy: 'network-only'});
  };
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    interval = setInterval(() => {
      reloadMe();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        padding: 20,
      }}>
      <BasicText textVariant="heading" style={{textAlign: 'center'}}>
        Please verify your email
      </BasicText>
      <BasicText
        style={{marginBottom: 20, textAlign: 'center'}}
        textVariant="subHeading"
        color="textSecondary">{`We sent you a link to ${me?.me.email}`}</BasicText>
      <BasicButton
        variant="unstyled"
        style={{marginBottom: 20}}
        onPress={() => {
          setChangeEmailWindowVisible(true);
        }}>
        <BasicText style={{textDecorationLine: 'underline'}}>
          Change email
        </BasicText>
      </BasicButton>
      <BasicButton
        style={{marginBottom: 10}}
        spacing="m"
        onPress={() => {
          resendVerificationEmail();
        }}>
        <BasicText color="textContrast" textVariant="button">
          Resend email
        </BasicText>
      </BasicButton>
      <BasicButton
        style={{marginBottom: 10}}
        spacing="m"
        onPress={() => {
          reloadMe();
        }}>
        <BasicText color="textContrast" textVariant="button">
          Refresh
        </BasicText>
      </BasicButton>
      <BasicButton
        backgroundColor="accentBackground1"
        spacing="m"
        onPress={() => {
          logout().finally(() => {
            setAccessToken('');
            isLoggedInVar(false);
          });
        }}>
        <BasicText textVariant="button">Log out</BasicText>
      </BasicButton>
      <BasicInputWindow
        autoCapitalize="none"
        autoCorrect={false}
        defaultValue={me?.me.email || ''}
        onSubmit={value => {
          editUser({variables: {email: value}});
          setChangeEmailWindowVisible(false);
        }}
        buttonText={'Submit'}
        visible={changeEmailWindowVisible}
        onClose={() => {
          setChangeEmailWindowVisible(false);
        }}
      />
    </View>
  );
};
