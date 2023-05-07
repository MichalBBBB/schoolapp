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
import {useSettings} from './utils/useSettings';
import {OnboardingStack} from './routes/OnboardingStack';
import BasicInputWindow from './components/modals/basicInputWindow';
import {VerifyEmailScreen} from './screens/VerifyEmailScreen';

export type TabStackParamList = {
  TaskStack: undefined;
  CalendarStack: undefined;
  SettingsStack: undefined;
  ProjectStack: undefined;
};

const Routes = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const client = useApolloClient();

  const {data: me} = useMeQuery();
  const settings = useSettings();

  const [theme] = useTheme();

  const Tab = createBottomTabNavigator<TabStackParamList>();

  const screens = (
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

  const getContent = () => {
    if (isLoggedIn) {
      if (me?.me.emailVerified) {
        if (settings?.isFirstTime) {
          return <OnboardingStack />;
        } else {
          return screens;
        }
      } else {
        return <VerifyEmailScreen />;
      }
    } else {
      return <AuthStack />;
    }
  };

  return (
    <>
      <AlertProvider>
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <NavigationContainer theme={theme}>
          {/* {isLoggedIn ? (
            me?.me.emailVerified ? (
              screens
            ) : (
              verifyEmailScreen
            )
          ) : (
            <AuthStack />
          )} */}
          {getContent()}
        </NavigationContainer>
      </AlertProvider>
    </>
  );
};

export default Routes;
