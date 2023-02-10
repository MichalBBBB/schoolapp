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
  style?: ViewStyle;
  variant?: 'filled' | 'outlined' | 'unstyled';
}

export const BasicButton = forwardRef<View, BasicButtonProps>((props, ref) => {
  const {
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
            variant == 'filled' ? theme.colors['accent'] : undefined,
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
