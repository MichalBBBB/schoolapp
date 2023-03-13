import {
  ApolloClient,
  ApolloProvider,
  makeVar,
  NormalizedCacheObject,
  useReactiveVar,
} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {Platform, Text, UIManager, View} from 'react-native';
import Routes from './Routes';
import {baseUri, createApolloClient} from './utils/createApolloClient';
import {ThemeProvider} from './contexts/ThemeContext';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/sk';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {PersistentQueueLink} from './utils/persistentQueueLink';
import {GetAllTasksDocument} from './generated/graphql';
import {MMKV} from 'react-native-mmkv';
import {allQueries} from './utils/allQueries';
import {Content} from './Content';
import notifee from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import {createRemindersChannel} from './utils/notifications';
import 'dayjs/locale/en';

export const isLoggedInVar = makeVar(true);
export const isOnlineVar = makeVar(true);
export const persistentQueueLink = new PersistentQueueLink();
dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.locale('en');

export const storage = new MMKV();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  const initializeApolloClient = async () => {
    await createApolloClient(persistentQueueLink).then(apolloClient => {
      setClient(apolloClient);
    });
  };

  useEffect(() => {
    initializeApolloClient();
    createRemindersChannel();
  }, []);

  if (!client) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  persistentQueueLink.setClient(client);

  return (
    <ApolloProvider client={client}>
      <Content />
    </ApolloProvider>
  );
};

export default App;
