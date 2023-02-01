import React, {Dispatch, RefObject, SetStateAction} from 'react';
import {TextInput, TextStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface BasicTextInputProps {
  backgroundColor?: string | undefined;
  borderRadius?: number | undefined;
  defaultValue?: string | undefined;
  onChangeText?: ((text: string) => void) | Dispatch<SetStateAction<string>>;
  padding?: number | undefined;
  color?: string | undefined;
  placeholder?: string | undefined;
  setRef?: RefObject<TextInput> | undefined;
  value?: string;
  style?: TextStyle;
}

export const BasicTextInput: React.FC<BasicTextInputProps> = ({
  backgroundColor,
  borderRadius,
  defaultValue,
  onChangeText,
  padding = 10,
  color,
  placeholder,
  setRef,
  value,
  style,
}) => {
  const [theme] = useTheme();
  return (
    <TextInput
      style={[
        {
          backgroundColor: backgroundColor || theme.colors.background,
          borderRadius,
          padding,
          color: color || theme.colors.text,
        },
        style,
      ]}
      onChangeText={text => {
        if (onChangeText) {
          onChangeText(text);
        }
      }}
      defaultValue={defaultValue}
      placeholder={placeholder}
      ref={setRef}
      value={value}
    />
  );
};
