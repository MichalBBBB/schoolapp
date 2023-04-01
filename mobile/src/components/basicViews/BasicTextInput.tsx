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
  variant?: 'filled' | 'unstyled' | 'outlined';
  backgroundColor?: keyof ColorsObject;
  borderRadius?: number;
  marginBottom?: number;
  borderWidth?: number;
  textVariant?: keyof TextVariantsObject;
  error?: string;
  containerStyle?: ViewStyle;
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
      ...restProps
    } = props;
    return (
      <View style={containerStyle}>
        <TextInput
          ref={ref}
          placeholderTextColor={theme.colors.textSecondary}
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
              marginBottom,
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
