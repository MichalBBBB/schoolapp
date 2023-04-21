import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {isLoggedInVar} from './App';
import AuthStack from './routes/AuthStack';
import {useReactiveVar} from '@apollo/client';
import TaskStack from './routes/TaskStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Image, Platform, StatusBar, View} from 'react-native';
import CalendarStack from './routes/CalendarStack';
import {useTheme} from './contexts/ThemeContext';
import SettingsStack from './routes/SettingsStack';
import ProjectStack from './routes/ProjectStack';
import {BasicIcon} from './components/basicViews/BasicIcon';
import {AlertProvider} from './contexts/AlertContext';

export type TabStackParamList = {
  TaskStack: undefined;
  CalendarStack: undefined;
  SettingsStack: undefined;
  ProjectStack: undefined;
};

const Routes = () => {
  let screens;
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const [theme] = useTheme();

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
          {isLoggedIn ? screens : <AuthStack />}
        </NavigationContainer>
      </AlertProvider>
    </>
  );
};

export default Routes;
