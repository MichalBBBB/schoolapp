import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {SettingsStackParamList} from '../../../routes/SettingsStack';

const TimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'TimeTableScreen'>
> = () => {
  return (
    <View>
      <View></View>
    </View>
  );
};

export default TimeTableScreen;
