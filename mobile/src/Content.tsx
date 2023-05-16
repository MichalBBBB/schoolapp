import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
  useReactiveVar,
} from '@apollo/client';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  isLoadingVar,
  isLoggedInVar,
  isOnlineVar,
  minVersionVar,
  persistentQueueLink,
} from './App';
import {DarkTheme, LightTheme, useTheme} from './contexts/ThemeContext';
import Routes from './Routes';
import {allQueries} from './utils/constants/allQueries';
import NetInfo from '@react-native-community/netinfo';
import {baseUri} from './utils/services/createApolloClient';
import {setRemindersFromApollo} from './utils/helperFunctions/reminderUtils';
import {useSettings} from './utils/hooks/useSettings';
import dayjs from 'dayjs';
import {useMeQuery} from './generated/graphql';
import {is24HourFormat} from 'react-native-device-time-format';
import {useSetSettings} from './mutationHooks/settings/setSettings';
import {v4 as uuidv4} from 'uuid';
import {AlertProvider} from './contexts/AlertContext';
import {isVersionHighEnough} from './utils/helperFunctions/isVersionHighEnough';
import {UpdateAppScreen} from './screens/UpdateAppScreen';
import Purchases from 'react-native-purchases';
import {RC_API_KEY} from '@env';

const is12hourConfig = {
  // abbreviated format options allowing localization
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
  // lowercase/short, optional formats for localization
  l: 'D/M/YYYY',
  ll: 'D MMM, YYYY',
  lll: 'D MMM, YYYY h:mm A',
  llll: 'ddd, MMM D, YYYY h:mm A',
};

const is24hourConfig = {
  // abbreviated format options allowing localization
  LTS: 'H:mm:ss',
  LT: 'H:mm',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY H:mm',
  LLLL: 'dddd, MMMM D, YYYY H:mm',
  // lowercase/short, optional formats for localization
  l: 'D/M/YYYY',
  ll: 'D MMM, YYYY',
  lll: 'D MMM, YYYY H:mm',
  llll: 'ddd, MMM D, YYYY H:mm',
};

export const replaceAllData = async (client: ApolloClient<any>) => {
  try {
    const result = await fetch(baseUri + '/check');
    const {minVersion} = await result.json();
    console.log(minVersion);
    minVersionVar(minVersion);
    isOnlineVar(true);
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
  } catch (e) {
    isOnlineVar(false);
  }
};

const openQueue = async (client: ApolloClient<any>) => {
  // check if the server is actually reachable
  try {
    await fetch(baseUri + '/check');
    await persistentQueueLink.open();
    isLoadingVar(true);
    await replaceAllData(client);
    isLoadingVar(false);
  } catch {
    persistentQueueLink.close();
    isOnlineVar(false);
  }
};

export const Content: React.FC = () => {
  // when we change global dayjs settings, the components don't automatically update
  // here we just make sure the whole app rerenders
  const [_forceRerenderingValue, setForceRerenderingValue] = useState('');
  const [isPurchasesConfigured, setIsPurchasesConfigured] = useState(false);
  const [isPurchasesLoggedIn, setIsPurchasesLoggedIn] = useState(false);
  const client = useApolloClient();
  const isOnline = useReactiveVar(isOnlineVar);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const settings = useSettings();
  const minVersion = useReactiveVar(minVersionVar);

  const {data: me} = useMeQuery();

  const updateLocale = async () => {
    const is24hour = await is24HourFormat();
    dayjs.updateLocale('en', {
      weekStart:
        settings?.startOfWeek == 'MON'
          ? 1
          : settings?.startOfWeek == 'SAT'
          ? 6
          : 0,
      formats: is24hour ? is24hourConfig : is12hourConfig,
    });
    // rerendering the whole app - the components won't automatically update when the locale changes
    setForceRerenderingValue(uuidv4());
  };

  const [theme, setTheme] = useTheme();
  useEffect(() => {
    if (isOnline && isLoggedIn) {
      openQueue(client);
    } else if (!isOnline) {
      persistentQueueLink.close();
    } else if (!isLoggedIn) {
      console.log('delete store');
      client.resetStore();
      setIsPurchasesLoggedIn(false);
    }
  }, [isOnline, isLoggedIn]);

  useEffect(() => {
    if (!isPurchasesConfigured && me && isLoggedIn) {
      console.log('logging in', RC_API_KEY);
      Purchases.configure({apiKey: RC_API_KEY, appUserID: me.me.id});
      setIsPurchasesConfigured(true);
      setIsPurchasesLoggedIn(true);
    } else if (!isPurchasesLoggedIn && me && isLoggedIn) {
      Purchases.logIn(me.me.id);
      setIsPurchasesLoggedIn(true);
    }
  }, [me, isPurchasesLoggedIn, isLoggedIn]);

  // set the locale based on settings
  useEffect(() => {
    updateLocale();
    // if settings darkmode is different than theme, update the theme
    if (theme.dark !== settings?.darkMode) {
      if (settings?.darkMode) {
        setTheme(DarkTheme);
      } else {
        setTheme(LightTheme);
      }
    }
  }, [settings]);

  // if the server is down or something similar,
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
        }, 30000);
      }
    })();

    return () => {
      clearInterval(interval);
    };
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
        {isVersionHighEnough(minVersion) ? <Routes /> : <UpdateAppScreen />}
      </PortalProvider>
    </GestureHandlerRootView>
  );
};
