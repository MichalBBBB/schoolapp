import React from 'react';
import {View} from 'react-native';
import {BasicButton} from './basicViews/BasicButton';
import {BasicIcon} from './basicViews/BasicIcon';
import {BasicText} from './basicViews/BasicText';

interface OnboardingContinueButtonProps {
  onPress: () => void;
}
export const OnboardingContinueButton: React.FC<
  OnboardingContinueButtonProps
> = ({onPress}) => {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 10,
        right: 0,
        bottom: 0,
        padding: 20,
        paddingBottom: 40,
      }}>
      <BasicButton
        borderRadius={40}
        spacing="m"
        onPress={() => {
          onPress();
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BasicText color="textContrast" textVariant="button">
            Continue
          </BasicText>
          <BasicIcon
            source={require('../../assets/Chevron-right.png')}
            style={{
              height: 25,
              width: 25,
              resizeMode: 'stretch',
            }}
            color="textContrast"
          />
        </View>
      </BasicButton>
    </View>
  );
};
