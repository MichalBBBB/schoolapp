import React, {forwardRef} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import type {
  ColorsObject,
  SpacingObject,
  TextVariantsObject,
} from '../../types/Theme';

interface BasicTextProps extends TextProps {
  children: string;
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
  } = props;
  const [theme] = useTheme();
  return (
    <Text
      style={[
        {
          padding: theme.spacing[spacing],
          color: theme.colors[color],
          ...theme.textVariants[textVariant],
        },
        style,
      ]}>
      {children}
    </Text>
  );
});
