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
import {GetAllTasksDocument, GetAllTasksQuery} from './generated/graphql';
import {MMKV} from 'react-native-mmkv';
import {allQueries} from './utils/allQueries';
import {Content} from './Content';
import notifee from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import {createRemindersChannel, setBadgeCount} from './utils/notifications';
import 'dayjs/locale/en';
import KeyboardManager from 'react-native-keyboard-manager/dist';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

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
  const [isHeadless, setIsHeadless] = useState(false);

  const initializeApolloClient = async () => {
    await createApolloClient(persistentQueueLink).then(apolloClient => {
      setClient(apolloClient);
    });
  };

  // initialize the Apollo client only if app is not headless
  // if it is, the message handler has to intialize it on its own
  useEffect(() => {
    messaging()
      .getIsHeadless()
      .then(isH => {
        setIsHeadless(isH);
        if (!isH) {
          initializeApolloClient();
          createRemindersChannel();
        }
      });
  }, []);

  const handler = async (message: FirebaseMessagingTypes.RemoteMessage) => {
    // if received notification to refresh badge, check if it's start of the day
    // if yes, set the badge number
    console.log('message', message);
    if (message.data && message.data.action == 'refresh') {
      if (dayjs().get('hours') == 0) {
        const client = await createApolloClient(persistentQueueLink);
        const tasks = client.readQuery<GetAllTasksQuery>({
          query: GetAllTasksDocument,
        });
        if (tasks) {
          let number = 0;

          tasks.getAllTasks.forEach(task => {
            if (dayjs(task.doDate).isSame(dayjs(), 'date')) {
              number += 1;
            }
          });
          setBadgeCount(number);
        }
      }
    }
  };

  useEffect(() => {
    messaging().onMessage(handler);
    messaging().setBackgroundMessageHandler(handler);
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

  if (isHeadless) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <Content />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
