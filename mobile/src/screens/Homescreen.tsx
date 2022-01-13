import React from 'react';
import {View, Text} from 'react-native';
import {useHelloQuery} from '../generated/graphql';
const HomeScreen = () => {
  const {data, error, loading} = useHelloQuery();
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default HomeScreen;
