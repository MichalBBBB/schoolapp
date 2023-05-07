import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet, TextInputProps} from 'react-native';
import AddButton from '../addButton';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {BasicTextInput} from '../basicViews/BasicTextInput';

interface addTaskWindowProps extends TextInputProps {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: (text: string) => void;
  defaultValue?: string;
  placeholder?: string;
  buttonText?: string;
}

const BasicInputWindow: React.FC<addTaskWindowProps> = ({
  onClose,
  visible,
  onSubmit,
  placeholder,
  defaultValue,
  buttonText = 'Add',
  ...props
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(defaultValue || '');
  }, [visible]);

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
            alignItems: 'center',
          }}>
          <BasicTextInput
            defaultValue={defaultValue}
            variant="unstyled"
            containerStyle={{flex: 1, marginRight: 5}}
            placeholder={placeholder || 'Name'}
            onChangeText={setText}
            autoFocus={true}
            {...props}
          />
          <BasicButton
            spacing="m"
            style={{borderRadius: 30}}
            onPress={() => {
              if (onSubmit) {
                onSubmit(text);
              }
            }}>
            <BasicText color="textContrast" textVariant="button">
              {buttonText}
            </BasicText>
          </BasicButton>
        </View>
      </BasicModalCard>
    </>
  );
};

export default BasicInputWindow;
