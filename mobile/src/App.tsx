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
import {createApolloClient} from './utils/createApolloClient';
import {ThemeProvider} from './contexts/ThemeContext';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import 'dayjs/locale/sk';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {PersistentQueueLink} from './utils/persistentQueueLink';
import {GetAllTasksDocument} from './generated/graphql';
import {MMKV} from 'react-native-mmkv';
import {allQueries} from './utils/allQueries';

export const isLoggedInVar = makeVar(true);
export const isOnlineVar = makeVar(false);
export const persistentQueueLink = new PersistentQueueLink();
dayjs.extend(weekday);
dayjs.locale('sk');

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

  const isOnline = useReactiveVar(isOnlineVar);

  useEffect(() => {
    initializeApolloClient();
  }, []);

  useEffect(() => {
    if (client) {
      console.log('client changed');
      const openQueue = async () => {
        persistentQueueLink.open();
        const promises: Array<Promise<any>> = [];
        allQueries.forEach(item => {
          promises.push(
            client.query({
              query: item,
              fetchPolicy: 'network-only',
            }),
          );
        });
        await Promise.all(promises);
        console.log('all loaded');
      };
      if (isOnline) {
        openQueue();
      } else {
        persistentQueueLink.close();
      }
    }
  }, [isOnline, client]);

  useEffect(() => {
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   if (state.isConnected) {
    //     queueLink.open();
    //   } else {
    //     queueLink.close();
    //   }
    // });

    // return () => unsubscribe();
    persistentQueueLink.open();
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
