import React from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface BasicButtonProps {
  onPress: () => void | undefined;
  backgroundColor?: string | undefined;
  borderRadius?: number | undefined;
  padding?: number | undefined;
  style?: ViewStyle | undefined;
}

export const BasicButton: React.FC<BasicButtonProps> = ({
  children,
  onPress,
  backgroundColor,
  borderRadius = 15,
  padding,
  style,
}) => {
  const [theme] = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: backgroundColor || theme.colors.accentBackground,
          borderRadius,
          padding,
        },
        styles.button,
        style,
      ]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
