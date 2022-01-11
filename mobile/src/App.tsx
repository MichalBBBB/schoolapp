import {ApolloProvider, makeVar} from '@apollo/client';
import React from 'react';
import {View} from 'react-native';
import {createApolloClient} from './utils/createApolloClient';

const apolloClient = createApolloClient();
export const isLoggedInVar = makeVar(true);
const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <View>
        <View></View>
      </View>
    </ApolloProvider>
  );
};

export default App;
