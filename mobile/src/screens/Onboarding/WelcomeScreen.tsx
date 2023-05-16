import React, {useLayoutEffect} from 'react';
import {Pressable, View} from 'react-native';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicText} from '../../components/basicViews/BasicText';
import {OnboardingContinueButton} from '../../components/onboardingContinueButton';
import {OnboardingStackScreenProps} from '../../types/navigationTypes';

export const WelcomeScreen: React.FC<
  OnboardingStackScreenProps<'WelcomeScreen'>
> = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {}}>
          <BasicText>Skip</BasicText>
        </Pressable>
      ),
    });
  });

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center', paddingTop: 200}}>
        <BasicText textVariant="title">Welcome to Dayto</BasicText>
      </View>

      <OnboardingContinueButton
        onPress={() => {
          navigation.navigate('AddSubjectsScreen');
        }}
      />
    </View>
  );
};
