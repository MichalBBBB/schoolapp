import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import AddButton from './addButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicTextInput} from './basicViews/BasicTextInput';

interface addTaskWindowProps {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: (text: string) => void;
  onModalHide?: () => void;
}

const BasicInputWindow: React.FC<addTaskWindowProps> = ({
  onClose,
  visible,
  onSubmit,
  onModalHide,
}) => {
  const textInputRef = createRef<TextInput>();
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible == true) {
      textInputRef.current?.focus();
    }
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
        }}
        onModalHide={() => {
          if (onModalHide) {
            onModalHide();
          }
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextInput
            style={{padding: 10, flex: 1}}
            placeholder="Subject name"
            onChangeText={setText}
            ref={textInputRef}
          />
          <AddButton
            onPress={() => {
              if (onSubmit) {
                onSubmit(text);
              }
            }}
          />
        </View>
      </BasicModalCard>
    </>
  );
};

export default BasicInputWindow;
