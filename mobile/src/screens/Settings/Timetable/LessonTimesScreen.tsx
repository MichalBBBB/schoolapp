import React from 'react';
import {useLayoutEffect} from 'react';
import {Pressable} from 'react-native';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';
import {BasicText} from '../../../components/basicViews/BasicText';
import {LessonTimesView} from '../../../components/lessonTimeView';
import {SettingsStackScreenProps} from '../../../utils/types';

const LessonTimesScreen: React.FC<
  SettingsStackScreenProps<'LessonTimesScreen'>
> = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('TimeTableScreen');
          }}>
          <BasicText>Continue</BasicText>
          <BasicIcon
            source={require('../../../../assets/Chevron-right.png')}
            style={{height: 25, width: 25, resizeMode: 'stretch'}}
          />
        </Pressable>
      ),
    });
  });

  return <LessonTimesView />;
};

export default LessonTimesScreen;
