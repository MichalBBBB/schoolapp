import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isLoggedInVar} from './App';
import HomeStack from './routes/HomeStack';
import AuthStack from './routes/AuthStack';
import {useReactiveVar} from '@apollo/client';

const Routes = () => {
  let screens;
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const Tab = createBottomTabNavigator();
  screens = (
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeStack} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {isLoggedIn ? screens : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
