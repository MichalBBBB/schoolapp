import {ApolloProvider, makeVar} from '@apollo/client';
import React from 'react';
import {Platform, Text, UIManager, View} from 'react-native';
import Routes from './Routes';
import HomeScreen from './screens/Homescreen';
import {createApolloClient} from './utils/createApolloClient';

const apolloClient = createApolloClient();
export const isLoggedInVar = makeVar(false);

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Routes />
    </ApolloProvider>
  );
};

export default App;
