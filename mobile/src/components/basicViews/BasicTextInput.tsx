import React, {Dispatch, forwardRef, RefObject, SetStateAction} from 'react';
import {
  KeyboardTypeOptions,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {
  ColorsObject,
  SpacingObject,
  TextVariantsObject,
} from '../../types/Theme';

interface BasicTextInputProps extends TextInputProps {
  spacing?: keyof SpacingObject;
  color?: keyof ColorsObject;
  variant?: 'filled' | 'unstyled' | 'outlined';
  backgroundColor?: keyof ColorsObject;
  borderRadius?: number;
  marginBottom?: number;
  borderWidth?: number;
  textVariant?: keyof TextVariantsObject;
}

export const BasicTextInput = forwardRef<TextInput, BasicTextInputProps>(
  (props, ref) => {
    const [theme] = useTheme();
    const {
      color = 'primary',
      spacing = 's',
      variant = 'filled',
      style,
      backgroundColor = 'accentBackground',
      borderRadius = 15,
      borderWidth = 3,
      marginBottom,
      textVariant = 'body',
      ...restProps
    } = props;
    return (
      <TextInput
        ref={ref}
        style={[
          {
            backgroundColor:
              variant == 'filled' ? theme.colors.accentBackground : undefined,
            borderRadius: borderRadius,
            padding: theme.spacing[spacing],
            color: theme.colors[color],
            borderColor:
              variant == 'outlined' ? theme.colors[backgroundColor] : undefined,
            borderWidth: variant == 'outlined' ? borderWidth : undefined,
            marginBottom,
            ...theme.textVariants[textVariant],
          },
          style,
        ]}
        {...restProps}
      />
    );
  },
);
