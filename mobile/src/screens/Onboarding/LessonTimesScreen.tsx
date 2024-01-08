import React from 'react';
import {View} from 'react-native';
import {BasicText} from '../../components/basicViews/BasicText';
import {LessonTimesView} from '../../components/lessonTimeView';
import {OnboardingContinueButton} from '../../components/onboardingContinueButton';
import {useGetAllSchedulesQuery} from '../../generated/graphql';
import {OnboardingStackScreenProps} from '../../utils/types';

export const LessonTimesScreen: React.FC<
  OnboardingStackScreenProps<'LessonTimeScreen'>
> = ({navigation}) => {
  const {data: schedules} = useGetAllSchedulesQuery();
  const defaultSchedule = schedules?.getAllSchedules.find(
    item => item.default,
  )!;
  return (
    <View style={{flex: 1}}>
      <View>
        <View style={{alignItems: 'center', paddingBottom: 15}}>
          <BasicText textVariant="heading" style={{marginBottom: 5}}>
            Enter times of your lessons
          </BasicText>
          <BasicText color="textSecondary" textVariant="subText">
            You can edit this later
          </BasicText>
        </View>
      </View>
      <LessonTimesView scheduleId={defaultSchedule.id} />
      <OnboardingContinueButton
        onPress={() => {
          navigation.navigate('TimeTableScreen');
        }}
      />
    </View>
  );
};
