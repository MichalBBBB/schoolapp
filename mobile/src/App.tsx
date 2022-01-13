import {ApolloProvider, makeVar} from '@apollo/client';
import React from 'react';
import {Text, View} from 'react-native';
import Routes from './Routes';
import HomeScreen from './screens/Homescreen';
import {createApolloClient} from './utils/createApolloClient';

const apolloClient = createApolloClient();
export const isLoggedInVar = makeVar(false);

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Routes />
    </ApolloProvider>
  );
};

export default App;
