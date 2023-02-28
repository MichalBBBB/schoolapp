import React, {forwardRef} from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {
  ColorsObject,
  SpacingObject,
  SubjectColorsObject,
} from '../../types/Theme';

interface BasicButtonProps extends PressableProps {
  spacing?: keyof SpacingObject;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
  variant?: 'filled' | 'outlined' | 'unstyled' | 'subject';
  backgroundColor?: keyof ColorsObject;
  borderColor?: keyof ColorsObject;
  borderWidth?: number;
  subjectColor?: keyof SubjectColorsObject;
}

export const BasicButton = forwardRef<View, BasicButtonProps>((props, ref) => {
  const {
    backgroundColor = 'accent',
    borderColor = 'accent',
    subjectColor,
    children,
    onPress,
    borderRadius = 15,
    spacing = 's',
    variant = 'filled',
    borderWidth = 3,
    style,
  } = props;
  const [theme] = useTheme();
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={[
        {
          backgroundColor:
            variant == 'filled'
              ? theme.colors[backgroundColor]
              : variant == 'subject' && subjectColor
              ? theme.subjectColors[subjectColor].secondary
              : undefined,
          borderRadius,
          padding: theme.spacing[spacing],
          borderColor:
            variant == 'outlined'
              ? theme.colors[borderColor]
              : variant == 'subject' && subjectColor
              ? theme.subjectColors[subjectColor].primary
              : undefined,
          borderWidth:
            variant == 'outlined' || variant == 'subject'
              ? borderWidth
              : undefined,
        },
        styles.button,
        style,
      ]}>
      {children}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
