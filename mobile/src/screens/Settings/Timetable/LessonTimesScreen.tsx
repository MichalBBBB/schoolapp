import React from 'react';
import {useLayoutEffect} from 'react';
import {Pressable, View} from 'react-native';
import {BasicIcon} from '../../../components/basicViews/BasicIcon';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicTextInput} from '../../../components/basicViews/BasicTextInput';
import {LessonTimesView} from '../../../components/lessonTimeView';
import {SettingsStackScreenProps} from '../../../utils/types';

const LessonTimesScreen: React.FC<
  SettingsStackScreenProps<'LessonTimesScreen'>
> = ({navigation, route}) => {
  const {schedule} = route.params;
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

  return (
    <View>
      <BasicTextInput
        style={{textAlign: 'center'}}
        defaultValue={schedule.name}
        variant="unstyled"
        textVariant="heading"
      />
      <LessonTimesView scheduleId={schedule.id} />
    </View>
  );
};

export default LessonTimesScreen;
