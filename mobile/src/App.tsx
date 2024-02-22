import {
  ApolloClient,
  ApolloProvider,
  makeVar,
  NormalizedCacheObject,
  useReactiveVar,
} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Text,
  UIManager,
  View,
} from 'react-native';
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
import 'react-native-get-random-values';
import {PersistentQueueLink} from './utils/persistentQueueLink';
import {
  AddNotificationTokenDocument,
  AddNotificationTokenMutation,
  GetAllTasksDocument,
  GetAllTasksQuery,
} from './generated/graphql';
import {MMKV} from 'react-native-mmkv';
import {allQueries} from './utils/allQueries';
import {Content, replaceAllData} from './Content';
import notifee from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import 'dayjs/locale/en';
import {RC_API_KEY} from '@env';
import {createRemindersChannel, setBadgeCount} from './utils/notifications';
import 'dayjs/locale/en';
import KeyboardManager from 'react-native-keyboard-manager/dist';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  checkNotifications,
  PERMISSIONS,
  request,
} from 'react-native-permissions';
import {handler} from './utils/registerNotificationHandlers';
import {setAccessToken} from './utils/AccessToken';

// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export const isLoggedInVar = makeVar(false);
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

export const isLoggedInStorageKey = 'isLoggedIn';

export const registerMessaging = async (client: ApolloClient<any>) => {
  request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS).then(result => {
    console.log('result', result);
  });
  checkNotifications().then(result => {
    console.log('result', result);
  });
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  await messaging().registerDeviceForRemoteMessages();

  const token = await messaging().getToken();
  console.log('token', token);
  await client.mutate<AddNotificationTokenMutation>({
    mutation: AddNotificationTokenDocument,
    variables: {token},
    context: {skipQueue: true},
  });
};

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
  const [appIsReady, setAppIsReady] = useState(false);

  const intializeApp = async () => {
    const client = await createApolloClient(persistentQueueLink);
    setClient(client);
    try {
      // app is online
      await fetch(baseUri + '/check');
      isOnlineVar(true);

      // check if user has valid refresh_token
      await fetch(baseUri + '/refresh_token', {
        credentials: 'include',
        method: 'post',
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          console.log(response);

          if (response.ok) {
            // user is logged in
            setAccessToken(response.accessToken);
            isLoggedInVar(true);
            registerMessaging(client);
          } else {
            // user isn't logged in
            setAccessToken('');
            isLoggedInVar(false);
          }
        });
    } catch {
      isOnlineVar(false);
      if (storage.getBoolean(isLoggedInStorageKey)) {
        isLoggedInVar(true);
      } else {
        isLoggedInVar(false);
      }
    }
    setAppIsReady(true);
  };

  // initialize the app
  useEffect(() => {
    intializeApp();
  }, []);

  useEffect(() => {
    messaging().onMessage(handler);
  }, []);

  if (!client || !appIsReady) {
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
