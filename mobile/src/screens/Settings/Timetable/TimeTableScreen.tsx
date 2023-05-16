import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Pressable} from 'react-native';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';
import {SettingsStackScreenProps} from '../../../types/navigationTypes';
import {TimeTableView} from '../../../components/TimeTableView';

const TimeTableScreen: React.FC<
  SettingsStackScreenProps<'TimeTableScreen'>
> = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('AdvancedTimeTableScreen');
          }}>
          <BasicText>Advanced</BasicText>
          <BasicIcon
            source={require('../../../../assets/Chevron-right.png')}
            style={{height: 25, width: 25, resizeMode: 'stretch'}}
          />
        </Pressable>
      ),
    });
  });

  return <TimeTableView />;
};

export default TimeTableScreen;
