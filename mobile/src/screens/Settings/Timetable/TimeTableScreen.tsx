import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, ScrollView} from 'react-native';
import {SettingsStackParamList} from '../../../routes/SettingsStack';

const TimeTableScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'TimeTableScreen'>
> = () => {
  return (
    <View>
      <ScrollView>
        <ScrollView horizontal={true}></ScrollView>
      </ScrollView>
    </View>
  );
};

export default TimeTableScreen;
