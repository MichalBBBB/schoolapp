import {ApolloProvider, makeVar} from '@apollo/client';
import React from 'react';
import {Platform, Text, UIManager, View} from 'react-native';
import Routes from './Routes';
import HomeScreen from './screens/Home/Homescreen';
import {createApolloClient} from './utils/createApolloClient';
import {ThemeProvider} from './contexts/ThemeContext';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/sk';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const apolloClient = createApolloClient();
export const isLoggedInVar = makeVar(false);
dayjs.extend(weekday);
dayjs.locale('sk');

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
        <GestureHandlerRootView style={{flex: 1}}>
          <PortalProvider>
            <PortalHost name="menu" />
            <Routes />
          </PortalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
