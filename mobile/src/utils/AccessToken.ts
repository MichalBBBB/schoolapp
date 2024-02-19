import {baseUri} from './createApolloClient';

let accessToken = '';

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (s: string) => {
  accessToken = s;
};

export const refreshToken = async () => {
  const result = await fetch(baseUri + '/refresh_token', {
    credentials: 'include',
    method: 'post',
  });
  setAccessToken((await result.json()).accessToken);
};
