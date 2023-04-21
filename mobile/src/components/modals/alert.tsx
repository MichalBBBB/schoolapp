import dayjs from 'dayjs';
import React from 'react';
import {View} from 'react-native';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';

interface AlertProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  text: string;
  subtext?: string;
  submitText?: string;
  cancelText?: string;
  submitDangerous?: boolean;
}
export const Alert: React.FC<AlertProps> = ({
  isVisible,
  onClose,
  onSubmit,
  text,
  subtext,
  submitText = 'Ok',
  cancelText = 'cancel',
  submitDangerous = false,
}) => {
  return (
    <BasicModalCard
      isVisible={isVisible}
      onBackdropPress={onClose}
      alignCard={'center'}
      shouldStretchWidth={false}
      style={{maxWidth: 300}}>
      <BasicText
        textVariant="subHeading"
        style={{padding: 20, textAlign: 'center'}}>
        {text}
      </BasicText>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <BasicButton
          style={{flex: 1}}
          spacing="m"
          onPress={() => {
            onClose();
          }}
          variant={'unstyled'}>
          <BasicText color="textSecondary" style={{fontWeight: 'bold'}}>
            {cancelText}
          </BasicText>
        </BasicButton>
        <BasicButton
          style={{flex: 1}}
          spacing="m"
          backgroundColor={'accentBackground1'}
          onPress={() => {
            onSubmit();
          }}
          variant={'filled'}>
          <BasicText
            color={submitDangerous ? 'dangerous' : 'primary'}
            style={{fontWeight: 'bold'}}>
            {submitText}
          </BasicText>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};
