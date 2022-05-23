import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface SecondaryTextProps {
  style?: TextStyle | undefined;
}

export const SecondaryText: React.FC<SecondaryTextProps> = ({
  style,
  children,
}) => {
  const [theme] = useTheme();
  return (
    <Text style={[style, styles.text, {color: theme.colors.textSecondary}]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {},
});
