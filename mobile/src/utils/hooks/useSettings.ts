import {useEffect} from 'react';
import {useMeQuery} from '../../generated/graphql';

export const useSettings = () => {
  const {data} = useMeQuery();
  return data?.me.settings;
};
