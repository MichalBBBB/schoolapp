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
  cancelButton?: boolean;
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
  cancelButton = true,
}) => {
  return (
    <BasicModalCard
      spacing="m"
      isVisible={isVisible}
      onBackdropPress={onClose}
      alignCard={'center'}
      shouldStretchWidth={false}
      style={{maxWidth: 300, minWidth: 250}}>
      <BasicText
        textVariant="subHeading"
        style={{paddingHorizontal: 20, textAlign: 'center', paddingTop: 10}}>
        {text}
      </BasicText>
      {subtext && (
        <BasicText
          color="textSecondary"
          style={{padding: 10, textAlign: 'center'}}>
          {subtext}
        </BasicText>
      )}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        {cancelButton && (
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
        )}
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
