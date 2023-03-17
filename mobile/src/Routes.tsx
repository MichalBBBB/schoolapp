import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {isLoggedInVar} from './App';
import AuthStack from './routes/AuthStack';
import {useReactiveVar} from '@apollo/client';
import TaskStack from './routes/TaskStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar, View} from 'react-native';
import CalendarStack from './routes/CalendarStack';
import {useTheme} from './contexts/ThemeContext';
import SettingsStack from './routes/SettingsStack';
import ProjectStack from './routes/ProjectStack';

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
        tabBarHideOnKeyboard: true,
        header: () => null,
        tabBarStyle: {borderTopWidth: 0},
      }}>
      <Tab.Screen name="TaskStack" component={TaskStack} />
      <Tab.Screen name="CalendarStack" component={CalendarStack} />

      <Tab.Screen name="ProjectStack" component={ProjectStack} />
      <Tab.Screen name="SettingsStack" component={SettingsStack} />
    </Tab.Navigator>
  );

  return (
    <>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme}>
        {isLoggedIn ? screens : <AuthStack />}
      </NavigationContainer>
    </>
  );
};

export default Routes;
