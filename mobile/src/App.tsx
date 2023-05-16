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
import {baseUri, createApolloClient} from './utils/services/createApolloClient';
import {ThemeProvider} from './contexts/ThemeContext';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/sk';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {PersistentQueueLink} from './utils/persistentQueueLink';
import {GetAllTasksDocument} from './generated/graphql';
import {MMKV} from 'react-native-mmkv';
import {allQueries} from './utils/constants/allQueries';
import {Content} from './Content';
import notifee from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import {createRemindersChannel} from './utils/services/notifications';
import 'dayjs/locale/en';
import KeyboardManager from 'react-native-keyboard-manager/dist';
import Purchases from 'react-native-purchases';
import {RC_API_KEY} from '@env';

export const isLoggedInVar = makeVar(true);
export const isOnlineVar = makeVar(true);
export const isLoadingVar = makeVar(true);
export const minVersionVar = makeVar('1.0.0');
export const persistentQueueLink = new PersistentQueueLink();
dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(CustomParseFormat);
dayjs.extend(RelativeTime);
dayjs.extend(calendar);
dayjs.extend(weekOfYear);
dayjs.locale('en');

export const storage = new MMKV();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableAutoToolbar(false);
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
    Purchases.configure({apiKey: RC_API_KEY});
  }, []);

  useEffect(() => {
    console.log('storage', storage.getString('queue'));
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
        <Content />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
