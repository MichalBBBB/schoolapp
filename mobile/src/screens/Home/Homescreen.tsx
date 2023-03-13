import React from 'react';
import {View, Text} from 'react-native';
import {BasicLoading} from '../../components/basicViews/BasicLoading';
import {useMeQuery} from '../../generated/graphql';
const HomeScreen = () => {
  const {data, error, loading} = useMeQuery();
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text>{JSON.stringify(data)}</Text>
      <Text>{JSON.stringify(error)}</Text>
    </View>
  );
};

export default HomeScreen;
