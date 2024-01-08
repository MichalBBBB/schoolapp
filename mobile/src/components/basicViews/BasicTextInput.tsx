import React, {Dispatch, forwardRef, RefObject, SetStateAction} from 'react';
import {
  KeyboardTypeOptions,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {
  ColorsObject,
  SpacingObject,
  TextVariantsObject,
} from '../../types/Theme';
import {BasicText} from './BasicText';

interface BasicTextInputProps extends TextInputProps {
  spacing?: keyof SpacingObject;
  color?: keyof ColorsObject;
  placeholderColor?: keyof ColorsObject;
  variant?: 'filled' | 'unstyled' | 'outlined';
  backgroundColor?: keyof ColorsObject;
  borderRadius?: number;
  marginBottom?: number;
  borderWidth?: number;
  textVariant?: keyof TextVariantsObject;
  error?: string;
  containerStyle?: ViewStyle;
  title?: string;
}

export const BasicTextInput = forwardRef<TextInput, BasicTextInputProps>(
  (props, ref) => {
    const [theme] = useTheme();
    const {
      color = 'primary',
      spacing = 's',
      variant = 'filled',
      style,
      backgroundColor = 'accentBackground1',
      borderRadius = 15,
      borderWidth = 3,
      marginBottom,
      textVariant = 'body',
      error,
      containerStyle,
      placeholderColor = 'textSecondary',
      title,
      ...restProps
    } = props;
    return (
      <View style={[{marginBottom}, containerStyle]}>
        {title && (
          <BasicText
            style={{marginLeft: 5, marginBottom: 5}}
            color="textSecondary">
            {title}
          </BasicText>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={theme.colors[placeholderColor]}
          style={[
            {
              backgroundColor:
                variant == 'filled'
                  ? error
                    ? '#fcb7b7'
                    : theme.colors[backgroundColor]
                  : undefined,
              borderRadius: borderRadius,
              padding: theme.spacing[spacing],
              color: theme.colors[color],
              borderColor:
                variant == 'outlined'
                  ? theme.colors[backgroundColor]
                  : undefined,
              borderWidth: variant == 'outlined' ? borderWidth : undefined,
              ...theme.textVariants[textVariant],
            },
            style,
          ]}
          {...restProps}
        />
        {error && (
          <BasicText style={{marginLeft: 5, marginTop: 5}} color="dangerous">
            {error}
          </BasicText>
        )}
      </View>
    );
  },
);
