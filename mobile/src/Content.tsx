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
import NetInfo from '@react-native-community/netinfo';
import {baseUri} from './utils/createApolloClient';
import {setRemindersFromApollo} from './utils/reminderUtils';

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
  setRemindersFromApollo(client);
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

  useEffect(() => {
    let interval: NodeJS.Timer;
    (async () => {
      const isActuallyOnline = (await NetInfo.fetch()).isInternetReachable;
      // when the server is down, isActuallyOnline is going to be true
      // we keep checking if the server started working every few seconds
      if (isActuallyOnline && !isOnline) {
        interval = setInterval(async () => {
          try {
            await fetch(baseUri + '/check');
            isOnlineVar(true);
          } catch (e) {}
        }, 10000);
      }
    })();

    return () => {
      clearInterval(interval);
    }; // cleanup function
  }, [isOnline]);
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <PortalProvider>
          <PortalHost name="menu" />
          <PortalHost name="modal" />
          <Routes />
        </PortalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};
