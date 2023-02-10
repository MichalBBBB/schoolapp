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
import {ColorsObject, SpacingObject} from '../../types/Theme';

interface BasicButtonProps extends PressableProps {
  spacing?: keyof SpacingObject;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
  variant?: 'filled' | 'outlined' | 'unstyled';
  backgroundColor?: keyof ColorsObject;
}

export const BasicButton = forwardRef<View, BasicButtonProps>((props, ref) => {
  const {
    backgroundColor = 'accent',
    children,
    onPress,
    borderRadius = 15,
    spacing = 's',
    variant = 'filled',
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
            variant == 'filled' ? theme.colors[backgroundColor] : undefined,
          borderRadius,
          padding: theme.spacing[spacing],
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
