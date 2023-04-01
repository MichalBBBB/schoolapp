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
import {
  DarkTheme,
  LightTheme,
  ThemeProvider,
  useTheme,
} from './contexts/ThemeContext';
import Routes from './Routes';
import {allQueries} from './utils/allQueries';
import NetInfo from '@react-native-community/netinfo';
import {baseUri} from './utils/createApolloClient';
import {setRemindersFromApollo} from './utils/reminderUtils';
import {useSettings} from './utils/useSettings';
import dayjs from 'dayjs';
import {
  GetAllLessonTimesDocument,
  GetAllTasksDocument,
} from './generated/graphql';

export const replaceAllData = async (client: ApolloClient<any>) => {
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
  // check if the server is actually reachable
  try {
    await fetch(baseUri + '/check');
    await persistentQueueLink.open();
    await replaceAllData(client);
  } catch {
    persistentQueueLink.close();
    isOnlineVar(false);
  }
};

export const Content: React.FC = () => {
  const client = useApolloClient();
  const isOnline = useReactiveVar(isOnlineVar);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const settings = useSettings();

  const [theme, setTheme] = useTheme();
  useEffect(() => {
    if (isOnline && isLoggedIn) {
      openQueue(client);
    } else if (!isOnline) {
      persistentQueueLink.close();
    }
  }, [isOnline, isLoggedIn]);

  // if the user is logged out, delete all the data from this device
  useEffect(() => {
    if (!isLoggedIn) {
      client.resetStore();
    }
  }, [isLoggedInVar]);

  // set the locale based on settings
  useEffect(() => {
    dayjs.updateLocale('en', {
      weekStart:
        settings?.startOfWeek == 'MON'
          ? 1
          : settings?.startOfWeek == 'SAT'
          ? 5
          : 0,
    });
    // if settings darkmode is different than theme, update the theme
    if (theme.dark !== settings?.darkMode) {
      if (settings?.darkMode) {
        setTheme(DarkTheme);
      } else {
        setTheme(LightTheme);
      }
    }
  }, [settings]);

  // if we the server is down or something similar,
  // set a timer that checks connectivity every 10 seconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    (async () => {
      const isActuallyOnline = (await NetInfo.fetch()).isConnected;
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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        isOnlineVar(true);
      } else if (!state.isConnected) {
        isOnlineVar(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PortalProvider>
        <Routes />
      </PortalProvider>
    </GestureHandlerRootView>
  );
};
