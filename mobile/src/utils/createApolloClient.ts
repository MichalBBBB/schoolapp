import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-community/async-storage';
import {TokenRefreshLink} from 'apollo-link-token-refresh';
import {
  AsyncStorageWrapper,
  MMKVStorageWrapper,
  MMKVWrapper,
  persistCache,
} from 'apollo3-cache-persist';
import jwtDecode from 'jwt-decode';
import {Platform} from 'react-native';
import {isLoggedInVar, storage} from '../App';
import {getAccessToken, setAccessToken} from './AccessToken';
import {onError} from '@apollo/client/link/error';
import {RetryLink} from '@apollo/client/link/retry';
import NetInfo from '@react-native-community/netinfo';
import SerializingLink from 'apollo-link-serialize';
import {PersistentQueueLink} from './persistentQueueLink';
import {BatchHttpLink} from '@apollo/client/link/batch-http';

export const uri =
  Platform.OS == 'ios'
    ? 'http://localhost:5002/graphql'
    : 'http://10.0.2.2:5002/graphql';

const httpLink = createHttpLink({
  uri: uri,
});

const batchHttpLink = new BatchHttpLink({
  uri,
});

const retryLink = new RetryLink();

const serializingLink = new SerializingLink();

const errorLink = onError(error => {
  console.warn(error);
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
    return fetch('http://localhost:5002/refresh_token', {
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
        console.warn('you are offline');
      } else {
        console.warn('Your refresh token is invalid. Try to relogin');
        isLoggedInVar(false);
      }
    });
  },
});

export const createApolloClient = async (
  persistentQueueLink: PersistentQueueLink,
) => {
  const cache = new InMemoryCache();

  await persistCache({
    cache,
    storage: new MMKVWrapper(storage),
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      persistentQueueLink,
      // serializingLink as any as ApolloLink,
      // retryLink,
      refreshLink,
      authLink,
      batchHttpLink,
    ]),
    cache: cache,
    credentials: 'include',
  });

  return client;
};
