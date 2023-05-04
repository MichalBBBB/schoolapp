import React from 'react';
import {View} from 'react-native';
import {BasicText} from '../../components/basicViews/BasicText';
import {OnboardingContinueButton} from '../../components/onboardingContinueButton';
import {TimeTableView} from '../../components/TimeTableView';
import {useSetSettings} from '../../mutationHooks/settings/setSettings';
import {OnboardingStackScreenProps} from '../../utils/types';

export const TimeTableScreen: React.FC<
  OnboardingStackScreenProps<'TimeTableScreen'>
> = ({navigation}) => {
  const [setSettings] = useSetSettings();
  return (
    <View style={{flex: 1}}>
      <BasicText
        textVariant="title"
        style={{paddingTop: 10, textAlign: 'center'}}>
        Set up your schedule
      </BasicText>
      <BasicText color="textSecondary" style={{textAlign: 'center'}}>
        You can change other settings of your schedule later
      </BasicText>
      <TimeTableView />
      <OnboardingContinueButton onPress={() => {}} />
      <OnboardingContinueButton
        onPress={() => {
          setSettings({
            isFirstTime: false,
          });
        }}
      />
    </View>
  );
};
