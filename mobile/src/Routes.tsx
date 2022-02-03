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

export type TabStackParamList = {
  HomeStack: undefined;
  TaskStack: undefined;
  CalendarStack: undefined;
};

const LighTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Routes = () => {
  let screens;
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const Tab = createBottomTabNavigator();
  screens = (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {borderTopWidth: 0},
      }}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="TaskStack" component={TaskStack} />
      <Tab.Screen name="CalendarStack" component={CalendarStack} />
    </Tab.Navigator>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer theme={LighTheme}>
        {isLoggedIn ? screens : <AuthStack />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default Routes;
