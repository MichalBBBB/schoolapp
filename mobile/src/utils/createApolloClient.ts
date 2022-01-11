import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {TokenRefreshLink} from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import {isLoggedInVar} from '../App';
import {getAccesToken, setAccesToken} from './AccesToken';

const httpLink = createHttpLink({
  uri: 'http://localhost:5002/graphql',
});

const authLink = setContext((_, {headers}) => {
  const token = getAccesToken();

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
    const token = getAccesToken();
    if (!token) {
      return true;
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
    return fetch('http://localhost:5000/fefresh_token', {
      credentials: 'include',
      method: 'post',
    });
  },
  handleFetch: accesToken => {
    setAccesToken(accesToken);
  },
  handleError: err => {
    console.warn('Your refresh token is invalid. Try to relogin');
    isLoggedInVar(false);
  },
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: ApolloLink.from([refreshLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    credentials: 'include',
  });
};
