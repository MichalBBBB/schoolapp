import React, {forwardRef} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import type {
  ColorsObject,
  SpacingObject,
  TextVariantsObject,
} from '../../types/Theme';

export interface BasicTextProps extends TextProps {
  spacing?: keyof SpacingObject;
  textVariant?: keyof TextVariantsObject;
  color?: keyof ColorsObject;
  style?: TextStyle;
}

export const BasicText = forwardRef<Text, BasicTextProps>((props, ref) => {
  const {
    children,
    spacing = 'none',
    textVariant = 'body',
    color = 'primary',
    style,
    ...rest
  } = props;
  const [theme] = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          padding: theme.spacing[spacing],
          color: theme.colors[color],
          fontSize: 14,
          ...theme.textVariants[textVariant],
        },
        style,
      ]}>
      {children}
    </Text>
  );
});
