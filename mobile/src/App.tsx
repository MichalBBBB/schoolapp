import {ApolloProvider, makeVar} from '@apollo/client';
import React from 'react';
import {Platform, Text, UIManager, View} from 'react-native';
import Routes from './Routes';
import HomeScreen from './screens/Homescreen';
import {createApolloClient} from './utils/createApolloClient';
import {ThemeProvider} from './contexts/ThemeContext';

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
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
