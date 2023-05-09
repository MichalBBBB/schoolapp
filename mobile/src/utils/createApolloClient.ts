import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  Reference,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {TokenRefreshLink} from 'apollo-link-token-refresh';
import {
  AsyncStorageWrapper,
  MMKVStorageWrapper,
  MMKVWrapper,
  persistCache,
} from 'apollo3-cache-persist';
import jwtDecode from 'jwt-decode';
import {Platform} from 'react-native';
import {isLoggedInVar, isOnlineVar, persistentQueueLink, storage} from '../App';
import {getAccessToken, setAccessToken} from './AccessToken';
import {onError} from '@apollo/client/link/error';
import {RetryLink} from '@apollo/client/link/retry';
import NetInfo from '@react-native-community/netinfo';
import SerializingLink from 'apollo-link-serialize';
import {PersistentQueueLink} from './persistentQueueLink';
import {BatchHttpLink} from '@apollo/client/link/batch-http';
import {API_URI_ANDROID, API_URI_DEFAULT} from '@env';

// export const baseUri =
//   Platform.OS == 'ios' ? 'http://localhost:5002' : 'http://10.0.2.2:5002';

// export const baseUri = 'https://api.dayto.app';

export const baseUri =
  Platform.OS == 'android' ? API_URI_ANDROID : API_URI_DEFAULT;

export const uri = baseUri + '/graphql';

const batchHttpLink = new BatchHttpLink({
  uri,
});

const errorLink = onError(error => {
  console.log(
    JSON.stringify(error.graphQLErrors),
    JSON.stringify(error.networkError?.stack),
  );
  if (error.networkError) {
    isOnlineVar(false);
    persistentQueueLink.close();
  }
});

const authLink = setContext((_, {headers}) => {
  const token = getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const refreshLink = new TokenRefreshLink({
  accessTokenField: 'accesToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) {
      console.log('invalidAccessToken');
      return false;
    }

    try {
      const {exp} = jwtDecode(token) as {exp: number};
      if (Date.now() > exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch(baseUri + '/refresh_token', {
      credentials: 'include',
      method: 'post',
    });
  },
  handleFetch: accesToken => {
    setAccessToken(accesToken);
  },
  handleError: err => {
    NetInfo.fetch().then(state => {
      if (
        !state.isConnected ||
        (err instanceof TypeError && err.message == 'Network request failed')
      ) {
        isOnlineVar(false);
      } else {
        isLoggedInVar(false);
      }
    });
  },
});

export const createApolloClient = async (
  persistentQueueLink: PersistentQueueLink,
) => {
  const cache = new InMemoryCache({
    // if an object is removed from the cache, it is not automatically removed from its references
    // here we specifify read functions, that filter out all unreachable objects
    typePolicies: {
      Task: {
        fields: {
          subtasks(existingSubtasks: Reference[], {canRead}) {
            return existingSubtasks ? existingSubtasks.filter(canRead) : [];
          },
        },
      },
      Project: {
        fields: {
          tasks(existingProjectTasks: Reference[], {canRead}) {
            return existingProjectTasks
              ? existingProjectTasks.filter(canRead)
              : [];
          },
        },
      },
      Schedule: {
        fields: {
          lessonTimes(existingLessonTimes: Reference[], {canRead}) {
            return existingLessonTimes
              ? existingLessonTimes.filter(canRead)
              : [];
          },
        },
      },
      Query: {
        fields: {
          getAllTasks(existingTasks: Reference[], {canRead}) {
            return existingTasks ? existingTasks.filter(canRead) : [];
          },
          getAllSubjects(existinSubjects: Reference[], {canRead}) {
            return existinSubjects ? existinSubjects.filter(canRead) : [];
          },
          getAllLessons(existingLessons: Reference[], {canRead}) {
            return existingLessons ? existingLessons.filter(canRead) : [];
          },
          getAllEvents(existingEvents: Reference[], {canRead}) {
            return existingEvents ? existingEvents.filter(canRead) : [];
          },
        },
      },
    },
  });

  await persistCache({
    cache,
    storage: new MMKVWrapper(storage),
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      persistentQueueLink,
      refreshLink,
      authLink,
      batchHttpLink,
    ]),
    cache: cache,
    credentials: 'include',
  });

  return client;
};
