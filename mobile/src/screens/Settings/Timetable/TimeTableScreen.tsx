import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Pressable} from 'react-native';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';
import {SettingsStackScreenProps} from '../../../utils/types';
import {TimeTableView} from '../../../components/TimeTableView';
import {usePremiumFeature} from '../../../utils/usePremiumFeature';

const TimeTableScreen: React.FC<
  SettingsStackScreenProps<'TimeTableScreen'>
> = ({navigation}) => {
  const premiumFeature = usePremiumFeature();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            premiumFeature(() => {
              navigation.navigate('AdvancedTimeTableScreen');
            });
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
