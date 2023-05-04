import React from 'react';
import {View} from 'react-native';
import {LessonTimesView} from '../../components/lessonTimeView';
import {OnboardingContinueButton} from '../../components/onboardingContinueButton';
import {OnboardingStackScreenProps} from '../../utils/types';

export const LessonTimesScreen: React.FC<
  OnboardingStackScreenProps<'LessonTimeScreen'>
> = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <LessonTimesView />
      <OnboardingContinueButton
        onPress={() => {
          navigation.navigate('TimeTableScreen');
        }}
      />
    </View>
  );
};
