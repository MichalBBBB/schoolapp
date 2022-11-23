import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {TaskStackParamList} from '../routes/TaskStack';

export const NotificationScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'NotificationScreen'>
> = () => {
  return <View></View>;
};
