import React, {Dispatch, forwardRef, RefObject, SetStateAction} from 'react';
import {
  KeyboardTypeOptions,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject, SpacingObject} from '../../types/Theme';

interface BasicTextInputProps extends TextInputProps {
  spacing?: keyof SpacingObject;
  color?: keyof ColorsObject;
  variant?: 'filled' | 'unstyled';
}

export const BasicTextInput = forwardRef<TextInput, BasicTextInputProps>(
  (props, ref) => {
    const [theme] = useTheme();
    const {
      color = 'primary',
      spacing = 's',
      variant = 'filled',
      style,
      ...restProps
    } = props;
    return (
      <TextInput
        ref={ref}
        style={[
          {
            backgroundColor:
              variant == 'filled' ? theme.colors.accentBackground : undefined,
            borderRadius: variant == 'filled' ? 15 : undefined,
            padding: theme.spacing[spacing],
            color: theme.colors[color],
          },
          style,
        ]}
        {...restProps}
      />
    );
  },
);
