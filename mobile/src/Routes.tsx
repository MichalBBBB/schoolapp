import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {isLoggedInVar} from './App';
import AuthStack from './routes/AuthStack';
import {useApolloClient, useReactiveVar} from '@apollo/client';
import TaskStack from './routes/TaskStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Image, Platform, StatusBar, StyleSheet, View} from 'react-native';
import CalendarStack from './routes/CalendarStack';
import {useTheme} from './contexts/ThemeContext';
import SettingsStack from './routes/SettingsStack';
import ProjectStack from './routes/ProjectStack';
import {BasicIcon} from './components/basicViews/BasicIcon';
import {AlertProvider} from './contexts/AlertContext';
import {
  MeDocument,
  useLogoutMutation,
  useMeLazyQuery,
  useMeQuery,
  useResendVerificationEmailMutation,
} from './generated/graphql';
import {BasicText} from './components/basicViews/BasicText';
import {BasicButton} from './components/basicViews/BasicButton';
import {setAccessToken} from './utils/AccessToken';
import {replaceAllData} from './Content';

export type TabStackParamList = {
  TaskStack: undefined;
  CalendarStack: undefined;
  SettingsStack: undefined;
  ProjectStack: undefined;
};

const Routes = () => {
  let screens;
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const client = useApolloClient();

  const {data: me} = useMeQuery();
  const [logout] = useLogoutMutation();
  const [resendVerificationEmail] = useResendVerificationEmailMutation();

  const [theme] = useTheme();

  const reloadMe = () => {
    client.query({query: MeDocument, fetchPolicy: 'network-only'});
  };
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoggedIn && !me?.me.emailVerified) {
      interval = setInterval(() => {
        reloadMe();
      }, 10000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn, me]);

  const verifyEmailScreen = (
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
    </View>
  );

  const Tab = createBottomTabNavigator<TabStackParamList>();

  screens = (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: Platform.OS == 'ios' ? false : true,
        header: () => null,
        tabBarStyle: {borderTopWidth: 0},
      }}>
      <Tab.Screen
        name="TaskStack"
        component={TaskStack}
        options={{
          title: 'Tasks',
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/Tasks.png')}
              style={{
                height: 25,
                width: 25,
                tintColor: focused
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CalendarStack"
        component={CalendarStack}
        options={{
          title: 'Calendar',
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/Calendar.png')}
              style={{
                height: 25,
                width: 25,
                tintColor: focused
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProjectStack"
        component={ProjectStack}
        options={{
          title: 'Projects',
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/Projects.png')}
              style={{
                height: 25,
                width: 25,
                tintColor: focused
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          title: 'Settings',
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/Settings.png')}
              style={{
                height: 25,
                width: 25,
                tintColor: focused
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );

  return (
    <>
      <AlertProvider>
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <NavigationContainer theme={theme}>
          {isLoggedIn ? (
            me?.me.emailVerified ? (
              screens
            ) : (
              verifyEmailScreen
            )
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
      </AlertProvider>
    </>
  );
};

export default Routes;
