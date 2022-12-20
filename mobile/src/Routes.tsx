import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {isLoggedInVar} from './App';
import HomeStack from './routes/HomeStack';
import AuthStack from './routes/AuthStack';
import {useReactiveVar} from '@apollo/client';
import TaskStack from './routes/TaskStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View} from 'react-native';
import CalendarStack from './routes/CalendarStack';
import {useTheme} from './contexts/ThemeContext';
import SettingsStack from './routes/SettingsStack';
import ProjectStack from './routes/ProjectStack';

export type TabStackParamList = {
  HomeStack: undefined;
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
        header: () => null,
        tabBarStyle: {borderTopWidth: 0},
      }}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="TaskStack" component={TaskStack} />
      <Tab.Screen name="CalendarStack" component={CalendarStack} />
      <Tab.Screen name="SettingsStack" component={SettingsStack} />
      <Tab.Screen name="ProjectStack" component={ProjectStack} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer theme={theme}>
      {isLoggedIn ? screens : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
