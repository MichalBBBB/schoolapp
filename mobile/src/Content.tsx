import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
  useReactiveVar,
} from '@apollo/client';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {isLoggedInVar, isOnlineVar, persistentQueueLink} from './App';
import {ThemeProvider} from './contexts/ThemeContext';
import Routes from './Routes';
import {allQueries} from './utils/allQueries';

const replaceAllData = async (client: ApolloClient<any>) => {
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
};

const openQueue = async (client: ApolloClient<any>) => {
  await persistentQueueLink.open();
  console.log('isOnline Change');
  await replaceAllData(client);
  console.log('all loaded');
};

export const Content: React.FC = () => {
  const client = useApolloClient();
  const isOnline = useReactiveVar(isOnlineVar);
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  useEffect(() => {
    console.log(isOnline);
    console.log('client changed');

    if (isOnline && isLoggedIn) {
      console.log('here', isOnline, isLoggedIn);
      openQueue(client);
    } else if (!isOnline) {
      persistentQueueLink.close();
    }
  }, [isOnline, isLoggedIn]);

  // useEffect(() => {
  //   if (isOnline && isLoggedIn) {
  //     replaceAllData(client);
  //   }
  // }, []);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <PortalProvider>
          <PortalHost name="menu" />
          <Routes />
        </PortalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
