import React from 'react';
import {View} from 'react-native';
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
}
export const Alert: React.FC<AlertProps> = ({
  isVisible,
  onClose,
  onSubmit,
  text,
  subtext,
  submitText = 'Ok',
  cancelText = 'cancel',
}) => {
  return (
    <BasicModalCard
      isVisible={isVisible}
      onBackdropPress={onClose}
      alignCard={'center'}>
      <BasicText textVariant="button">{text}</BasicText>
      <View style={{flexDirection: 'row'}}></View>
    </BasicModalCard>
  );
};
