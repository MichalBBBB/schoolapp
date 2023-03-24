import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {SubjectColorsObject} from '../types/Theme';
import AddButton from './addButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicTextInput} from './basicViews/BasicTextInput';
import {ColorPicker} from './colorPicker';
import {v4 as uuidv4} from 'uuid';
import {useCreateSubject} from '../mutationHooks/subject/createSubject';
import {ColorPickerPopup} from './colorPickerPopup';

interface AddSubjectWindowProps {
  visible: boolean;
  onClose?: () => void;
}

const AddSubjectWindow: React.FC<AddSubjectWindowProps> = ({
  onClose,
  visible,
}) => {
  const [addSubject] = useCreateSubject();

  const textInputRef = createRef<TextInput>();
  const [text, setText] = useState('');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [color, setColor] = useState<keyof SubjectColorsObject>('blue');

  const [theme] = useTheme();

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
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ColorPickerPopup
            initialColor={color}
            onSubmit={color => {
              setColor(color);
            }}
            trigger={
              <Pressable
                onPress={() => {
                  setIsColorPickerVisible(true);
                }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  backgroundColor: theme.subjectColors[color].primary,
                }}
              />
            }
          />

          <BasicTextInput
            autoFocus={true}
            variant="unstyled"
            style={{flex: 1, marginRight: 5}}
            placeholder={'Subject name'}
            onChangeText={setText}
            ref={textInputRef}
          />
          <AddButton
            onPress={() => {
              addSubject({
                id: uuidv4(),
                name: text,
                colorName: color,
              });
              if (onClose) {
                onClose();
              }
            }}
          />
        </View>
        <ColorPicker
          isVisible={isColorPickerVisible}
          onClose={() => setIsColorPickerVisible(false)}
          onSubmit={color => {
            setColor(color);
            setIsColorPickerVisible(false);
          }}
        />
      </BasicModalCard>
    </>
  );
};

export default AddSubjectWindow;
