import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isLoggedInVar} from './App';
import HomeStack from './routes/HomeStack';
import AuthHomeScreen from './screens/AuthHomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthStack from './routes/AuthStack';

const Routes = () => {
  let screens;

  const Tab = createBottomTabNavigator();
  screens = (
    <Tab.Navigator>
      <Tab.Screen name="home" component={HomeStack} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      {isLoggedInVar() ? screens : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
