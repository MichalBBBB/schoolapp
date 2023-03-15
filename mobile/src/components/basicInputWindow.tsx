import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import AddButton from './addButton';
import {BasicButton} from './basicViews/BasicButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicText} from './basicViews/BasicText';
import {BasicTextInput} from './basicViews/BasicTextInput';

interface addTaskWindowProps {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  buttonText?: string;
}

const BasicInputWindow: React.FC<addTaskWindowProps> = ({
  onClose,
  visible,
  onSubmit,
  placeholder,
  buttonText = 'Add',
}) => {
  const [text, setText] = useState('');

  const closeWindow = () => {
    setText('');
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <BasicModalCard
        alignCard="flex-end"
        isVisible={visible}
        avoidKeyboard={true}
        onBackdropPress={() => {
          closeWindow();
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <BasicTextInput
            variant="unstyled"
            style={{flex: 1, marginRight: 5}}
            placeholder={placeholder || 'Name'}
            onChangeText={setText}
            autoFocus={true}
          />
          <BasicButton
            spacing="m"
            style={{borderRadius: 30}}
            onPress={() => {
              if (onSubmit) {
                onSubmit(text);
              }
            }}>
            <BasicText color="textContrast">{buttonText}</BasicText>
          </BasicButton>
        </View>
      </BasicModalCard>
    </>
  );
};

export default BasicInputWindow;
