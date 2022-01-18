import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {isLoggedInVar} from './App';
import HomeStack from './routes/HomeStack';
import AuthStack from './routes/AuthStack';
import {useReactiveVar} from '@apollo/client';
import TaskStack from './routes/TaskStack';

export type TabStackParamList = {
  HomeStack: undefined;
  TaskStack: undefined;
};

const Routes = () => {
  let screens;
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const Tab = createBottomTabNavigator();
  screens = (
    <Tab.Navigator screenOptions={{header: () => null}}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="TaskStack" component={TaskStack} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {isLoggedIn ? screens : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
